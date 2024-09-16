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

import { env } from "../../utilities/env";
import { UserPreferenceStore } from "../preferences";
import { UserSessionStore } from "../sessions";
import { UserStore } from "../users";
import { inMemoryUserObjects } from "./in-memory";

/**
 * Create objects to manage user accounts.
 * 
 * @returns A triplet of objects related to user accounts.
 */
export function defaultUserObjects(): [UserStore, UserSessionStore, UserPreferenceStore] {
    const users = env("USER_EMAILS", "")
        .split(",")
        .filter(email => email.length > 0)
        .map((email, index) => ({ uid: index + 1000, lastModified: new Date(), email }));
    return inMemoryUserObjects(users);
}
