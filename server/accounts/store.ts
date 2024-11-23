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

import { ValidEmail } from "./email";
import { SessionSchema, UserSchema, SettingSchema, SessionID, UserID, SettingName } from "./schemas";

export type UserQuery = 
    | { by: 'id', id: string }
    | { by: 'email', email: ValidEmail };

export interface AccountStore {
    newUserID(): Promise<UserID>;
    insertUser(user: UserSchema): Promise<void>;
    updateUser(user: UserSchema): Promise<void>;
    deleteUser(user: UserSchema): Promise<void>;
    getUser(query: UserQuery): Promise<UserSchema | undefined>;

    newSessionID(): Promise<SessionID>;
    insertSession(session: SessionSchema): Promise<void>;
    updateSession(session: SessionSchema): Promise<void>;
    deleteSession(sessionID: SessionID): Promise<void>;
    getSession(sessionID: SessionID): Promise<SessionSchema | undefined>;

    putSettings(settings: SettingSchema[]): Promise<void>;
    deleteSettings(userID: UserID, names: SettingName[]): Promise<Set<SettingName>>;
    getSettings(userID: UserID, names: SettingName[]): Promise<SettingSchema[]>;
}
