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

import { v4 as uuidv4 } from "uuid";
import { SessionID, SessionModel, SettingModel, SettingName, UserID, UserModel } from "./models";
import { AccountStore, UserQuery } from "./store";

export interface InMemoryAccountStoreOptions {
    readonly users?: UserModel[]
}

export class InMemoryAccountStore implements AccountStore {
    constructor({ users = [] }: InMemoryAccountStoreOptions = {}) {
        this.users = users;
        this.sessions = [];
        this.settings = new Map();
    }

    private readonly users: UserModel[];
    private readonly sessions: SessionModel[];
    private readonly settings: Map<UserID, Map<SettingName, string>>;

    async newUserID(): Promise<UserID> {
        return uuidv4();
    }

    async insertUser(user: UserModel): Promise<void> {
        this.users.push({ ...user });
    }

    async updateUser(user: UserModel): Promise<void> {
        const toUpdate = this.users.findIndex(c => c.id === user.id);
        if (toUpdate === -1) {
            throw new Error(`User <${user.id}> does not exist`);
        }
        this.users[toUpdate] = { ...user };
    }

    async deleteUser(user: UserModel): Promise<void> {
        const toUpdate = this.users.findIndex(c => c.id === user.id);
        if (toUpdate === -1) {
            throw new Error(`User <${user.id}> does not exist`);
        }
        this.users.splice(toUpdate, 1);
    }

    async getUser(query: UserQuery): Promise<UserModel | undefined> {
        const user = this.users.find(userQueryPredicate(query));
        if (user === undefined) {
            return undefined;
        }
        return { ...user };
    }

    async newSessionID(): Promise<SessionID> {
        return uuidv4();
    }

    async insertSession(session: SessionModel): Promise<void> {
        this.sessions.push({ ...session });
    }

    async updateSession(session: SessionModel): Promise<void> {
        const toUpdate = this.sessions.findIndex(c => c.id === session.id);
        if (toUpdate === -1) {
            throw new Error(`Session <${session.id}> does not exist`);
        }
        this.sessions[toUpdate] = { ...session };
    }

    async deleteSession(sessionID: SessionID): Promise<void> {
        const toDelete = this.sessions.findIndex(session => session.id === sessionID);
        if (toDelete === -1) {
            throw new Error(`Session <${sessionID}> does not exist`);
        }
        this.sessions.splice(toDelete, 1);
    }

    async getSession(sessionID: SessionID): Promise<SessionModel | undefined> {
        const session = this.sessions.find(session => session.id === sessionID);
        if (session === undefined) {
            return undefined;
        }
        return { ...session };
    }

    async putSettings(settings: SettingModel[]): Promise<void> {
        for (const { userID, name, value } of settings) {
            const existingUserSettings = this.settings.get(userID);
            if (existingUserSettings !== undefined) {
                existingUserSettings.set(name, value);
            } else {
                const newUserSettings = new Map<SettingName, string>();
                newUserSettings.set(name, value);
                this.settings.set(userID, newUserSettings);
            }
        }
    }

    async deleteSettings(userID: UserID, names: SettingName[]): Promise<Set<SettingName>> {
        const deleted = new Set<SettingName>();
        for (const name of names) {
            const userSettings = this.settings.get(userID);
            if (userSettings === undefined) {
                continue;
            }
            if (userSettings.delete(name)) {
                deleted.add(name);
            }
        }
        return deleted;
    }

    async getSettings(userID: UserID, names: SettingName[]): Promise<SettingModel[]> {
        const reads: SettingModel[] = [];
        for (const name of names) {
            const userSettings = this.settings.get(userID);
            if (userSettings === undefined) {
                continue;
            }
            const value = userSettings.get(name);
            if (value === undefined) {
                continue;
            }
            reads.push({ userID, name, value });
        }
        return reads;
    }
}

function userQueryPredicate(query: UserQuery): (user: UserModel) => boolean {
    switch (query.by) {
        case 'id':
            return user => user.id === query.id;
        case 'email':
            return user => user.email === query.email;
    }
}
