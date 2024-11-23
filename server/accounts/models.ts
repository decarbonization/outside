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
import { HashedPassword, ValidToken } from "./password";

export type UserID = string;

export interface UserModel {
    readonly id: UserID;
    readonly createdAt: Date;
    readonly email: ValidEmail;
    readonly password: HashedPassword;
    readonly lastModified: Date;
    readonly isVerified: boolean;
}

export type SessionID = string;

export interface SessionModel {
    readonly id: SessionID;
    readonly createdAt: Date;
    readonly userID: string;
    readonly token?: ValidToken;
    readonly tokenExpiresAt?: Date;
}

export type SettingName =
    | 'units'
    | 'tz'

export interface SettingModel {
    readonly userID: UserID;
    readonly name: SettingName;
    readonly value: string;
}
