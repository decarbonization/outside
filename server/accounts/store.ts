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
import { SessionModel, UserModel, SettingModel, SessionID, UserID, SettingName } from "./models";

export type UserQuery = 
    | { by: 'id', id: string }
    | { by: 'email', email: ValidEmail };

export interface AccountStore {
    newUserID(): Promise<UserID>;
    insertUser(user: UserModel): Promise<void>;
    updateUser(user: UserModel): Promise<void>;
    deleteUser(user: UserModel): Promise<void>;
    getUser(query: UserQuery): Promise<UserModel | undefined>;

    newSessionID(): Promise<SessionID>;
    insertSession(session: SessionModel): Promise<void>;
    updateSession(session: SessionModel): Promise<void>;
    deleteSession(sessionID: SessionID): Promise<void>;
    getSession(sessionID: SessionID): Promise<SessionModel | undefined>;

    putSettings(settings: SettingModel[]): Promise<void>;
    deleteSettings(userID: UserID, names: SettingName[]): Promise<Set<SettingName>>;
    getSettings(userID: UserID, names: SettingName[]): Promise<SettingModel[]>;
}
