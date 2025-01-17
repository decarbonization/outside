/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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
import { Account } from "./account";
import { isValidEmail } from "./email";
import { UserSystemError } from "./errors";
import { checkPassword, hashPassword, isValidPassword, isValidToken, token } from "./password";
import { SessionID, SessionSchema, SessionTokenScope, UserID, UserSchema } from "./schemas";
import { AccountStore } from "./store";

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

    /**
     * Check that a token is valid and has a required scope,
     * consuming it if the check passes, throwing an error otherwise.
     * 
     * @param sessionID The identifier for the session the token belongs to.
     * @param token A token OTP.
     * @param scope The scope the token must have.
     */
    private async tryConsumeToken(sessionID: SessionID, token: string, scopes: readonly SessionTokenScope[]): Promise<SessionSchema> {
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
        if (!scopes.every(scope => session.tokenScopes?.includes(scope))) {
            throw new UserSystemError('missingScope', "Token missing one or more required scopes");
        }

        const updatedSession = {
            ...session,
            token: undefined,
            tokenExpiresAt: undefined,
            tokenScopes: undefined,
        };
        await this.store.updateSession(updatedSession); // TODO: is this actually updating?
        return updatedSession;
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

        const newUser = await this.store.insertUser({
            email,
            password: await hashPassword(password, this.primarySalt),
            isVerified: false,
            scopes: [],
        });

        const newSession: SessionSchema = await this.store.insertSession({
            userID: newUser.id,
            token: await token(),
            tokenExpiresAt: addMinutes(new Date(), 15),
            tokenScopes: ['verifyPassword'],
        });

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

        const newSession: SessionSchema = await this.store.insertSession({
            userID: user.id,
            token: !user.isVerified ? await token() : undefined,
            tokenExpiresAt: !user.isVerified ? addMinutes(new Date(), 15) : undefined,
            tokenScopes: ['verifyPassword'],
        });

        return newSession;
    }

    async signOut(sessionID: SessionID): Promise<void> {
        await this.store.deleteSession(sessionID);
    }

    async verifyEmail(sessionID: SessionID, email: string, token: string): Promise<void> {
        if (!isValidEmail(email)) {
            throw new UserSystemError('invalidEmail', "Invalid email");
        }

        await this.tryConsumeToken(sessionID, token, ['verifyPassword']);

        const user = await this.store.getUser({ by: 'email', email });
        if (user === undefined) {
            await this.store.deleteSession(sessionID);
            throw new UserSystemError('unknownUser', "No user");
        }
        if (user.isVerified) {
            throw new UserSystemError('userAlreadyVerified', "User already verified");
        }
        await this.store.updateUser({ ...user, isVerified: true });
    }

    async beginForgotPassword(email: string): Promise<SessionSchema> {
        if (!isValidEmail(email)) {
            throw new UserSystemError('invalidEmail', "Invalid email");
        }

        const user = await this.store.getUser({ by: 'email', email });
        if (user === undefined) {
            throw new UserSystemError('unknownUser', "No user");
        }

        const newSession: SessionSchema = await this.store.insertSession({
            userID: user.id,
            token: await token(),
            tokenExpiresAt: addMinutes(new Date(), 15),
            tokenScopes: ['verifyPassword', 'recoverPassword'],
        });
        return newSession;
    }

    async finishForgotPassword(sessionID: SessionID, token: string, newPassword: string): Promise<SessionSchema> {
        if (!isValidPassword(newPassword)) {
            throw new UserSystemError('invalidPassword', "Invalid password");
        }

        const session = await this.tryConsumeToken(sessionID, token, ['verifyPassword', 'recoverPassword']);

        const user = await this.store.getUser({ by: 'id', id: session.userID });
        if (user === undefined) {
            throw new UserSystemError('unknownUser', "No user");
        }
        await this.store.updateUser({
            ...user,
            password: await hashPassword(newPassword, this.primarySalt),
            isVerified: true,
        })
        
        return session;
    }

    async changePassword(
        userID: UserID,
        oldPassword: string,
        newPassword: string
    ): Promise<UserSchema> {
        if (!isValidPassword(oldPassword)) {
            throw new UserSystemError('invalidPassword', "Old password invalid");
        }
        if (!isValidPassword(newPassword)) {
            throw new UserSystemError('invalidPassword', "New password invalid");
        }

        const user = await this.store.getUser({ by: 'id', id: userID });
        if (user === undefined) {
            throw new UserSystemError('unknownUser', "No user");
        }

        for (const salt of this.salts) {
            if (user.password === await hashPassword(oldPassword, salt)) {
                const updatedUser = {
                    ...user,
                    password: await hashPassword(newPassword, this.primarySalt),
                };
                await this.store.updateUser(updatedUser);
                return updatedUser;
            }
        }
        throw new UserSystemError('incorrectPassword', "Old password is wrong");
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
