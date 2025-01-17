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
import { HashedPassword, ValidToken } from "./password";

export type UserScope = string;
export type UserID = number;

export interface UserSchema {
    readonly id: UserID;
    readonly email: ValidEmail;
    readonly password: HashedPassword;
    readonly isVerified: boolean;
    readonly scopes: UserScope[];
}
export type NewUserSchema = Omit<UserSchema, 'id'>;


export type SessionTokenScope = 'verifyPassword' | 'recoverPassword';
export type SessionID = number;

export interface SessionSchema {
    readonly id: SessionID;
    readonly userID: UserID;
    readonly token?: ValidToken;
    readonly tokenExpiresAt?: Date;
    readonly tokenScopes?: SessionTokenScope[];
}
export type NewSessionSchema = Omit<SessionSchema, 'id'>;

export type SettingName =
    | 'units'
    | 'tz'

export interface SettingSchema {
    readonly userID: UserID;
    readonly name: SettingName;
    readonly value: string;
}
