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

import { User, UserID } from "./users";

/*
    CREATE TABLE user_keys (
        key TEXT NOT NULL PRIMARY KEY,
        uid BIGINT REFERENCES users(uid) ON DELETE CASCADE,
        value TEXT NOT NULL
    );
 */

/**
 * An object containing key-value pairs specified to a single Outside user account.
 */
export type UserPreferenceValues<Keys extends string> = {
    readonly [Key in Keys]?: string;
};

/**
 * A persistent key-value store for Outside user accounts.
 */
export interface UserPreferenceStore {
    /**
     * Retrieve stored key-values for a specified user.
     * 
     * @param uid The user to retrieve values for.
     * @param keys The keys to retrieve.
     * @returns An object containing the key-values stored for the user.
     */
    getValues<Keys extends string>(uid: UserID, ...keys: Keys[]): Promise<UserPreferenceValues<Keys>>;

    /**
     * Update stored key-values for a specified user.
     * 
     * @param uid The user to set values for.
     * @param newValues The key-value pairs to store.
     * @returns A set containing the keys whose values were updated.
     */
    setValues<Keys extends string>(uid: UserID, newValues: UserPreferenceValues<Keys>): Promise<Set<Keys>>;

    /**
     * Delete stored key-values for a specified user.
     * 
     * @param uid The user to delete stored values for.
     * @param keys The keys to delete.
     * @returns A set containing the keys whose values were deleted.
     */
    deleteValues<Keys extends string>(uid: UserID, ...keys: Keys[]): Promise<Set<Keys>>;
}

/**
 * The persistent key-values associated with a specific user.
 */
export class UserPreferences {
    /**
     * Create a user preferences object.
     * 
     * @param uid A logged-in user or `undefined` if there is no active session.
     * @param store A store containing the key-value pairs associated with the user.
     */
    constructor(
        private readonly uid: UserID | undefined,
        private readonly store: UserPreferenceStore
    ) { }

    /**
     * Retrieve stored key-values for the user.
     * 
     * @param keys The keys to retrieve.
     * @returns An object containing the key-values stored for the user.
     */
    async get<Keys extends string>(...keys: Keys[]): Promise<UserPreferenceValues<Keys>> {
        if (this.uid !== undefined) {
            return this.store.getValues(this.uid, ...keys);
        } else {
            return {};
        }
    }

    /**
     * Update stored key-values for the user.
     * 
     * @param newValues The key-value pairs to store.
     * @returns A set containing the keys whose values were updated.
     */
    async set<Keys extends string>(newValues: UserPreferenceValues<Keys>): Promise<Set<Keys>> {
        if (this.uid !== undefined) {
            return this.store.setValues(this.uid, newValues);
        } else {
            return new Set();
        }
    }

    /**
     * Delete stored key-values for the user.
     * 
     * @param keys The keys to delete.
     * @returns A set containing the keys whose values were deleted.
     */
    async delete<Keys extends string>(...keys: Keys[]): Promise<Set<Keys>> {
        if (this.uid !== undefined) {
            return this.store.deleteValues(this.uid, ...keys);
        } else {
            return new Set();
        }
    }
}
