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

/*
    CREATE TABLE users (
        uid BIGSERIAL PRIMARY KEY,
        last_modified TIMESTAMP NOT NULL,
        email TEXT NOT NULL
    );
 */

/**
 * The unique identifier for a user.
 */
export type UserID = number;

/**
 * A query to lookup the details of a user account.
 */
export type UserQuery =
    | { by: "uid", uid: UserID }
    | { by: "email", email: string };

/**
 * An object encapsulating a user account in the Outside app.
 */
export interface User {
    /**
     * The unique identifier of the user.
     */
    readonly uid: UserID;

    /**
     * When the user was last modified.
     */
    readonly lastModified: Date;

    /**
     * The email address of the user.
     */
    readonly email: string;
}

/**
 * An object encapsulating the data required to create a new user account.
 */
export type NewUser = Omit<User, "uid" | "lastModified">;

/**
 * An object which manages user accounts in the Outside app.
 */
export interface UserStore {
    /**
     * Insert a new user into the store.
     * 
     * @param newUser The details of the new user.
     * @returns The newly inserted user.
     */
    insertUser(newUser: NewUser): Promise<User>;

    /**
     * Check whether a user matching a specified is present in the store.
     * 
     * @param query A query specifying the user to find.
     * @returns `true` if a user was found; `false` otherwise.
     */
    hasUser(query: UserQuery): Promise<boolean>;

    /**
     * Find a user matching the given query in the store.
     * 
     * @param query A query specifying the user to find.
     * @returns A matching user.
     * @throws `UnknownUserError` if no matching user is found.
     */
    getUser(query: UserQuery): Promise<User>;

    /**
     * Delete a user matching the given query from the store.
     * 
     * @param query A query specifying the user to delete.
     */
    deleteUser(query: UserQuery): Promise<void>;

    /**
     * Find a user matching the given query in the store,
     * or insert a new user with the specified details.
     * 
     * @param query A query specifying the user to find.
     * @param newUser The details of a new user if none can be found.
     */
    getOrInsertUser(query: UserQuery, newUser: () => NewUser): Promise<User>;
}

/**
 * An error which indicates a user already exists with an email address.
 */
export class DuplicateEmailUserError extends RESTError {
    /**
     * Create an error indicating a user already exists with a given email.
     * 
     * @param email The email address which already exists.
     */
    constructor(public readonly email: string) {
        super(409, "Conflict", `User account with email <${email}> already exists`);
    }
}

/**
 * An error which indicates no user exists matching a query.
 */
export class UnknownUserError extends RESTError {
    /**
     * Create an error indicating no user exists matching a query.
     * 
     * @param query The relevant query.
     */
    constructor(public readonly query: UserQuery) {
        super(404, "Not Found", `No user account matching <${JSON.stringify(query)}>`);
    }
}
