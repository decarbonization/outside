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

import { RESTError } from "serene-front";
import { UserID } from "./users";

/*
    CREATE TABLE user_sessions (
        sid BIGSERIAL PRIMARY KEY,
        uid BIGINT REFERENCES users(uid) ON DELETE CASCADE,
        expires_on DATE NOT NULL,
        otp TEXT
    );
 */

/**
 * A unique value identifying a user session.
 */
export type UserSessionID = number;

/**
 * An object which encapsulates details about a newly created user session.
 */
export interface NewUserSession {
    /**
     * The unique identifier of a newly created user session.
     */
    readonly sid: UserSessionID;

    /**
     * The one-time password of a newly created user session.
     */
    readonly otp: string;
}

/**
 * Encapsulates management of user sessions for the Outside application.
 */
export interface UserSessionStore {
    /**
     * Start a session for the specified user.
     * 
     * @param uid The unique identifier of the user. 
     * @returns A new unique session identifier.
     */
    startSession(uid: UserID): Promise<NewUserSession>;

    /**
     * Authenticate a previously started session.
     * 
     * @param sid The unique identifier of a user session.
     * @param otp The one-time password to use to authenticate the session.
     */
    authenticateSession(sid: UserSessionID, otp: string): Promise<UserID>;

    /**
     * End a user session.
     * 
     * @param sid The unique identifier of a user session.
     */
    endSession(sid: UserSessionID): Promise<void>;

    /**
     * Look up the user information associated with a session identifier.
     * 
     * @param sid The unique identifier of a user session.
     * @returns Information about the user which the session id belongs to,
     * or `undefined` if the session is not valid.
     */
    getSessionUserID(sid: UserSessionID): Promise<UserID | undefined>;
}

/**
 * An error which indicates no such session exists.
 */
export class NoSuchUserSessionError extends RESTError {
    /**
     * Create an error indicating that no user session exists.
     * 
     * @param sid A user session identifier.
     */
    constructor(public readonly sid: UserSessionID) {
        super(403, "Forbidden", `User session <${sid}> does not exist`);
    }
}

/**
 * An error which indicates a session has expired.
 */
export class ExpiredUserSessionError extends RESTError {
    /**
     * Create an error indicating that a user session has expired
     * 
     * @param sid A user session identifier.
     */
    constructor(public readonly sid: UserSessionID) {
        super(403, "Forbidden", `User session <${sid}> is expired`);
    }
}

/**
 * An error which indicates a session has not yet been authenticated.
 */
export class UnauthenticatedUserSessionError extends RESTError {
    /**
     * Create an error indicating that a user session has not been authenticated yet.
     * 
     * @param sid A user session identifier.
     */
    constructor(public readonly sid: UserSessionID) {
        super(403, "Forbidden", `User session <${sid}> is not authenticated`);
    }
}
