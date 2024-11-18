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
import { SessionModel, UserModel } from "./models";

export type UserQuery = 
    | { by: 'id', id: string }
    | { by: 'email', email: ValidEmail };

export interface AccountStore {
    newUserID(): Promise<string>;
    insertUser(user: UserModel): Promise<void>;
    updateUser(user: UserModel): Promise<void>;
    deleteUser(user: UserModel): Promise<void>;
    getUser(query: UserQuery): Promise<UserModel | undefined>;

    newSessionID(): Promise<string>;
    insertSession(session: SessionModel): Promise<void>;
    updateSession(session: SessionModel): Promise<void>;
    deleteSession(sessionID: string): Promise<void>;
    getSession(sessionID: string): Promise<SessionModel | undefined>;
}
