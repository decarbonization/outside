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

export interface UserSchema {
    readonly id: UserID;
    readonly email: ValidEmail;
    readonly password: HashedPassword;
    readonly isVerified: boolean;
}

export type SessionID = string;

export interface SessionSchema {
    readonly id: SessionID;
    readonly userID: string;
    readonly token?: ValidToken;
    readonly tokenExpiresAt?: Date;
}

export type SettingName =
    | 'units'
    | 'tz'

export interface SettingSchema {
    readonly userID: UserID;
    readonly name: SettingName;
    readonly value: string;
}
