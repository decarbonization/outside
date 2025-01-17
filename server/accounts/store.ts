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

import { ValidEmail } from "./email";
import { NewSessionSchema, NewUserSchema, SessionID, SessionSchema, SettingName, SettingSchema, UserID, UserSchema } from "./schemas";

export type UserQuery = 
    | { by: 'id', id: UserID }
    | { by: 'email', email: ValidEmail };

export interface AccountStore {
    insertUser(user: NewUserSchema): Promise<UserSchema>;
    updateUser(user: UserSchema): Promise<void>;
    deleteUser(user: UserSchema): Promise<void>;
    getUser(query: UserQuery): Promise<UserSchema | undefined>;

    insertSession(session: NewSessionSchema): Promise<SessionSchema>;
    updateSession(session: SessionSchema): Promise<void>;
    deleteSession(sessionID: SessionID): Promise<void>;
    getSession(sessionID: SessionID): Promise<SessionSchema | undefined>;

    putSettings(settings: SettingSchema[]): Promise<void>;
    deleteSettings(userID: UserID, names: SettingName[]): Promise<Set<SettingName>>;
    getSettings(userID: UserID, names: SettingName[]): Promise<SettingSchema[]>;
}
