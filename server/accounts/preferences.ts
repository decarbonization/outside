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

import { UserID } from "./users";

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
export type UserPreferences<Keys extends string> = {
    readonly [Key in Keys]?: string;
};

/**
 * A persistent key-value store for Outside user accounts.
 */
export interface UserPreferenceStore {
    /**
     * Update stored key-values for a specified user.
     * 
     * @param uid The user to set values for.
     * @param newValues The key-value pairs to store.
     * @returns A set containing the keys whose values were updated.
     */
    setValues<Keys extends string>(uid: UserID, newValues: UserPreferences<Keys>): Promise<Set<Keys>>;

    /**
     * Retrieve stored key-values for a specified user.
     * 
     * @param uid The user to retrieve values for.
     * @param keys The keys to retrieve.
     * @returns An object containing the key-values stored for the user.
     */
    getValues<Keys extends string>(uid: UserID, ...keys: Keys[]): Promise<UserPreferences<Keys>>;

    /**
     * Delete stored key-values for a specified user.
     * 
     * @param uid The user to delete stored values for.
     * @param keys The keys to delete.
     * @returns A set containing the keys whose values were deleted.
     */
    deleteValues<Keys extends string>(uid: UserID, ...keys: Keys[]): Promise<Set<Keys>>;
}
