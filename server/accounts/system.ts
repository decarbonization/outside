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

import { addMinutes } from "date-fns";
import { isValidEmail } from "./email";
import { UserSystemError } from "./errors";
import { SessionID, SessionSchema, UserSchema } from "./schemas";
import { checkPassword, hashPassword, isValidToken, isValidPassword, token } from "./password";
import { AccountStore } from "./store";
import { Account } from "./account";

export interface UserSystemOptions {
    readonly store: AccountStore;
    readonly salts: string[];
}

export class UserSystem {
    constructor({ store, salts }: UserSystemOptions) {
        if (salts.length === 0) {
            throw new RangeError(`Specify at least one salt`);
        }
        this.store = store;
        this.salts = salts;
    }
    
    private readonly store: AccountStore;
    private readonly salts: string[];

    private get primarySalt(): string {
        return this.salts[0];
    }

    async signUp(email: string, password: string): Promise<SessionSchema> {
        if (!isValidEmail(email)) {
            throw new UserSystemError('invalidEmail', "Invalid email");
        }
        if (!isValidPassword(password)) {
            throw new UserSystemError('invalidPassword', "Invalid password");
        }
        if (await this.store.getUser({ by: 'email', email }) !== undefined) {
            throw new UserSystemError('duplicateEmail', "Email in use");
        }

        const newUser: UserSchema = {
            id: await this.store.newUserID(),
            email,
            password: await hashPassword(password, this.primarySalt),
            isVerified: false,
        };
        await this.store.insertUser(newUser);

        const newSession: SessionSchema = {
            id: await this.store.newSessionID(),
            userID: newUser.id,
            token: await token(),
            tokenExpiresAt: addMinutes(new Date(), 15),
        };
        await this.store.insertSession(newSession);

        return newSession;
    }

    async signIn(email: string, password: string): Promise<SessionSchema> {
        if (!isValidEmail(email)) {
            throw new UserSystemError('invalidEmail', "Invalid email");
        }
        if (!isValidPassword(password)) {
            throw new UserSystemError('invalidPassword', "Invalid password");
        }

        const user = await this.store.getUser({ by: 'email', email });
        if (user === undefined) {
            throw new UserSystemError('unknownUser', "No user");
        }
        if (!await checkPassword(user.password, password, this.salts)) {
            throw new UserSystemError('incorrectPassword', "Wrong password");
        }
        
        const newSession: SessionSchema = {
            id: await this.store.newSessionID(),
            userID: user.id,
            token: !user.isVerified ? await token() : undefined,
            tokenExpiresAt: !user.isVerified ? addMinutes(new Date(), 15) : undefined,
        };
        await this.store.insertSession(newSession);
        
        return newSession;
    }

    async signOut(sessionID: SessionID): Promise<void> {
        await this.store.deleteSession(sessionID);
    }

    async verifyEmail(sessionID: SessionID, email: string, token: string): Promise<void> {
        if (!isValidEmail(email)) {
            throw new UserSystemError('invalidEmail', "Invalid email");
        }
        if (!isValidToken(token)) {
            throw new UserSystemError('invalidPassword', `Invalid Token`);
        }

        const session = await this.store.getSession(sessionID);
        if (session === undefined) {
            throw new UserSystemError('unknownSession', "Invalid session");
        }
        if (session.token === undefined) {
            throw new UserSystemError('invalidPassword', "Invalid Token");
        }
        if (session.tokenExpiresAt !== undefined && new Date() > session.tokenExpiresAt) {
            throw new UserSystemError('expiredSession', "Token has expired");
        }
        if (session.token !== token) {
            throw new UserSystemError('incorrectPassword', "Bad token");
        }

        const user = await this.store.getUser({ by: 'email', email });
        if (user === undefined) {
            await this.store.deleteSession(sessionID);
            throw new UserSystemError('unknownUser', "No user");
        }
        if (user.isVerified) {
            throw new UserSystemError('userAlreadyVerified', "User already verified");
        }
        await this.store.updateUser({ ...user, isVerified: true });

        await this.store.updateSession({ ...session, token: undefined, tokenExpiresAt: undefined });
    }

    async getAccount(sessionID: SessionID | undefined): Promise<Account | undefined> {
        if (sessionID === undefined) {
            return undefined;
        }
        const session = await this.store.getSession(sessionID);
        if (session === undefined) {
            return undefined;
        }
        const user = await this.store.getUser({ by: 'id', id: session.userID });
        if (user === undefined) {
            console.warn(`No user associated with session <${session.id}>, destroying session`);
            await this.store.deleteSession(session.id);
            return undefined;
        }
        return new Account(session, user);
    }
}
