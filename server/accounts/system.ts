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
import { SessionModel, UserModel } from "./models";
import { checkPassword, hashPassword, isValidOTP, isValidPassword, otp } from "./password";
import { UserStore } from "./store";

export interface UserSystemOptions {
    readonly store: UserStore;
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
    
    private readonly store: UserStore;
    private readonly salts: string[];

    private get primarySalt(): string {
        return this.salts[0];
    }

    async signUp(email: string, password: string): Promise<SessionModel> {
        if (!isValidEmail(email)) {
            throw new UserSystemError('invalidEmail', "Invalid email");
        }
        if (!isValidPassword(password)) {
            throw new UserSystemError('invalidPassword', "Invalid password");
        }
        if (await this.store.getUser({ by: 'email', email }) !== undefined) {
            throw new UserSystemError('duplicateEmail', "Email in use");
        }

        const createdAt = new Date();
        const newUser: UserModel = {
            id: await this.store.newUserID(),
            createdAt,
            email,
            password: await hashPassword(password, this.primarySalt),
            lastModified: createdAt,
            isVerified: false,
        };
        await this.store.insertUser(newUser);

        const newSession: SessionModel = {
            id: await this.store.newSessionID(),
            createdAt,
            userID: newUser.id,
            otp: await otp(),
            otpExpiresAt: addMinutes(createdAt, 15),
        };
        await this.store.insertSession(newSession);

        return newSession;
    }

    async signIn(email: string, password: string): Promise<SessionModel> {
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
        
        const createdAt = new Date();
        const newSession: SessionModel = {
            id: await this.store.newSessionID(),
            createdAt,
            userID: user.id,
            otp: !user.isVerified ? await otp() : undefined,
            otpExpiresAt: !user.isVerified ? addMinutes(createdAt, 15) : undefined,
        };
        await this.store.insertSession(newSession);
        
        return newSession;
    }

    async signOut(sessionID: string): Promise<void> {
        await this.store.deleteSession({ by: "id", id: sessionID });
    }

    async verifyEmail(sessionID: string, email: string, otp: string): Promise<void> {
        if (!isValidEmail(email)) {
            throw new UserSystemError('invalidEmail', "Invalid email");
        }
        if (!isValidOTP(otp)) {
            throw new UserSystemError('invalidPassword', `Invalid OTP`);
        }

        const session = await this.store.getSession({ by: 'id', id: sessionID });
        if (session === undefined) {
            throw new UserSystemError('unknownSession', "Invalid session");
        }
        if (session.otp === undefined) {
            throw new UserSystemError('invalidPassword', "Invalid OTP");
        }
        if (session.otpExpiresAt !== undefined && new Date() > session.otpExpiresAt) {
            throw new UserSystemError('expiredSession', "OTP has expired");
        }
        if (session.otp !== otp) {
            throw new UserSystemError('incorrectPassword', "Bad OTP");
        }

        const user = await this.store.getUser({ by: 'email', email });
        if (user === undefined) {
            await this.store.deleteSession({ by: 'id', id: sessionID });
            throw new UserSystemError('unknownUser', "No user");
        }
        await this.store.updateUser({ ...user, isVerified: true });

        await this.store.updateSession({ ...session, otp: undefined, otpExpiresAt: undefined });
    }

    async getSessionAndUser(sessionID: string | undefined): Promise<[SessionModel | undefined, UserModel | undefined]> {
        if (sessionID === undefined) {
            return [undefined, undefined];
        }

        const session = await this.store.getSession({ by: 'id', id: sessionID });
        if (session === undefined) {
            return [undefined, undefined];
        }
        
        const user = await this.store.getUser({ by: 'id', id: session.userID });
        if (user === undefined) {
            await this.store.deleteSession({ by: 'id', id: sessionID });
            return [undefined, undefined];
        }
        
        return [session, user];
    }
}
