/*
 * outside weather app
 * Copyright (C) 2024  MAINTAINERS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { randomBytes } from "crypto";
import { addDays } from "date-fns";
import { UserPreferenceStore, UserPreferences } from "../preferences";
import { ExpiredUserSessionError, NewUserSession, NoSuchUserSessionError, UnauthenticatedUserSessionError, UserSessionID, UserSessionStore } from "../sessions";
import { DuplicateEmailUserError, NewUser, UnknownUserError, User, UserID, UserQuery, UserStore } from "../users";

/**
 * Create objects to manage user accounts in-memory.
 * 
 * @param initialUsers A pre-existing collection of users.
 * @returns A triplet of objects related to user accounts.
 */
export function inMemoryUserObjects(initialUsers: User[] = []): [UserStore, UserSessionStore, UserPreferenceStore] {
    const users = new InMemoryUserStore(initialUsers);
    const sessions = new InMemoryUserSessionStore(users);
    const preferences = new InMemoryUserPreferenceStore(users);
    return [users, sessions, preferences];
}

class InMemoryUserStore implements UserStore {
    /**
     * Create an in-memory user store.
     * 
     * @param initialUsers A pre-existing collection of users.
     */
    constructor(initialUsers: User[]) {
        this.users = initialUsers;
    }

    /**
     * The users known by this store.
     */
    private readonly users: User[];

    private predicateFor(query: UserQuery): (user: User) => boolean {
        switch (query.by) {
            case "uid": {
                return user => user.uid === query.uid;
            }
            case "email": {
                return user => user.email === query.email;
            }
        }
    }

    async insertUser(newUser: NewUser): Promise<User> {
        const existing = await this.getUser({ by: "email", email: newUser.email });
        if (existing !== undefined) {
            throw new DuplicateEmailUserError(newUser.email);
        }
        const newUid = this.users.reduce((prev, next) => Math.max(prev, next.uid + 1), 0);
        const user: User = {
            uid: newUid,
            lastModified: new Date(),
            email: newUser.email,
        };
        this.users.push(user);
        return user;
    }

    async hasUser(query: UserQuery): Promise<boolean> {
        return this.users.some(this.predicateFor(query));
    }

    async getUser(query: UserQuery): Promise<User> {
        const match = this.users.find(this.predicateFor(query));
        if (match === undefined) {
            throw new UnknownUserError(query);
        }
        return match;
    }

    async deleteUser(query: UserQuery): Promise<void> {
        const match = this.users.findIndex(this.predicateFor(query));
        if (match === -1) {
            throw new UnknownUserError(query);
        }
        this.users.splice(match, 1);
    }
}

class InMemoryUserSessionStore implements UserSessionStore {
    /**
     * Create an in-memory user session store.
     * 
     * @param users The user store to use.
     */
    constructor(users: InMemoryUserStore) {
        this.users = users;
        this.active = new Map();
        this.nextSid = 0;
    }

    /**
     * A store containing user data.
     */
    private readonly users: UserStore;

    /**
     * A map containing all active user sessions.
     */
    private readonly active: Map<UserSessionID, UserSession>;

    /**
     * The next session ID to vend.
     */
    private nextSid: UserSessionID;

    async startSession(email: string): Promise<NewUserSession> {
        const { uid } = await this.users.getUser({ by: "email", email });
        const sid = this.nextSid++;
        const expiresOn = addDays(new Date(), 28);
        const otp = randomBytes(16).toString("hex");
        this.active.set(sid, {
            sid,
            uid,
            expiresOn,
            otp,
        });
        return {
            sid,
            otp,
        };
    }

    async authenticateSession(sid: UserSessionID, otp: string): Promise<UserID> {
        const session = this.active.get(sid);
        if (session === undefined || session.otp === undefined) {
            throw new NoSuchUserSessionError(sid);
        }
        if (new Date() > session.expiresOn) {
            throw new ExpiredUserSessionError(sid);
        }
        if (session.otp === otp) {
            session.otp = undefined;
            // ^ Transition to authorized.
        }
        return session.uid;
    }

    async endSession(sid: UserSessionID): Promise<void> {
        if (!this.active.delete(sid)) {
            throw new NoSuchUserSessionError(sid);
        }
    }

    async getSessionUserID(sid: UserSessionID): Promise<UserID | undefined> {
        const session = this.active.get(sid);
        if (session === undefined
            || session.otp !== undefined
            || new Date() > session.expiresOn) {
            return undefined;
        }
        return session.uid;
    }
}

/**
 * Object encapsulating information about an active user session.
 */
interface UserSession {
    /**
     * A value uniquely identifying this session.
     */
    readonly sid: number;

    /**
     * A value uniquely identifying the user the session belongs to.
     */
    readonly uid: UserID;

    /**
     * When the session will expire.
     */
    expiresOn: Date;

    /**
     * The current one-time password for this session.
     * Cleared once the session has been authenticated.
     */
    otp: string | undefined;
}

class InMemoryUserPreferenceStore implements UserPreferenceStore {
    /**
     * Create an in-memory user preference store.
     * 
     * @param users The user store to use.
     */
    constructor(users: InMemoryUserStore) {
        this.users = users;
        this.data = new Map();
    }

    /**
     * A store containing user data.
     */
    private readonly users: InMemoryUserStore;

    /**
     * The stored user preferences.
     */
    private readonly data: Map<UserID, Map<string, string>>;

    async setValues<Keys extends string>(uid: UserID, newValues: UserPreferences<Keys>): Promise<Set<Keys>> {
        if (!await this.users.hasUser({ by: "uid", uid })) {
            throw new UnknownUserError({ by: "uid", uid });
        }
        let allValues = this.data.get(uid);
        if (allValues === undefined) {
            allValues = new Map();
            this.data.set(uid, allValues);
        }
        const updated = new Set<Keys>;
        for (const [key, value] of Object.entries(newValues) as [Keys, string][]) {
            allValues.set(key, value);
            updated.add(key);
        }
        return updated;
    }

    async getValues<Keys extends string>(uid: UserID, ...keys: Keys[]): Promise<UserPreferences<Keys>> {
        if (!await this.users.hasUser({ by: "uid", uid })) {
            throw new UnknownUserError({ by: "uid", uid });
        }
        const allValues = this.data.get(uid);
        if (allValues === undefined) {
            return {};
        }
        const values: WriteableUserPreferences<Keys> = {};
        for (const key of keys) {
            values[key] = allValues.get(key);
        }
        return values;
    }

    async deleteValues<Keys extends string>(uid: UserID, ...keys: Keys[]): Promise<Set<Keys>> {
        if (!await this.users.hasUser({ by: "uid", uid })) {
            throw new UnknownUserError({ by: "uid", uid });
        }
        const allValues = this.data.get(uid);
        if (allValues === undefined) {
            return new Set();
        }
        const removed = new Set<Keys>();
        for (const key of keys) {
            if (allValues.delete(key)) {
                removed.add(key);
            }
        }
        return removed;
    }
}

/**
 * A variant of `UserPreferences` which can be written to.
 */
export type WriteableUserPreferences<Keys extends string> = {
    [Key in Keys]?: string;
};
