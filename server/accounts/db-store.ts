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

import { map } from "its-it/map";
import { onlyOne } from "its-it/only-one";
import sql, { Sql } from "sql-template-tag";
import { DB } from "../db/client";
import { ValidEmail } from "./email";
import { UserSystemError } from "./errors";
import { HashedPassword, ValidToken } from "./password";
import { NewSessionSchema, NewUserSchema, SessionID, SessionSchema, SessionTokenScope, SettingName, SettingSchema, UserID, UserSchema, UserScope } from "./schemas";
import { AccountStore, UserQuery } from "./store";

export class DBAccountStore implements AccountStore {
    constructor() { }

    async insertUser(user: NewUserSchema): Promise<UserSchema> {
        const insertResult = await DB.query<{ id: string }>(sql`
            INSERT INTO public.users ("createdAt", "updatedAt", email, password, "isVerified", scopes)
                VALUES (NOW(), NOW(), ${user.email}, ${user.password}, ${user.isVerified}, ${user.scopes})
                RETURNING id
        `);
        const modelId = onlyOne(insertResult.rows).id;
        return {
            id: Number(modelId),
            email: user.email as ValidEmail,
            password: user.password as HashedPassword,
            isVerified: user.isVerified,
            scopes: user.scopes as UserScope[],
        };
    }

    async updateUser(user: UserSchema): Promise<void> {
        const updateResult = await DB.query(sql`
            UPDATE public.users
                SET "updatedAt"  = NOW(),
                     email       = ${user.email},
                     password    = ${user.password},
                    "isVerified" = ${user.isVerified},
                     scopes      = ${user.scopes}
                WHERE id = ${user.id} 
        `);
        if (updateResult.rowCount !== 1) {
            throw new UserSystemError('unknownUser', `User <${user.id}> does not exist`);
        }
    }

    async deleteUser(user: UserSchema): Promise<void> {
        const deleteResult = await DB.query(sql`
            DELETE FROM public.users
                WHERE id = ${user.id}
        `);
        if (deleteResult.rowCount !== 1) {
            throw new UserSystemError('unknownUser', `User <${user.id}> does not exist`);
        }
    }

    async getUser(query: UserQuery): Promise<UserSchema | undefined> {
        const criteria = ((): Sql => {
            switch (query.by) {
                case "id":
                    return sql`id = ${query.id}`;
                case "email":
                    return sql`email = ${query.email}`;
            }
        })();
        const selectResult = await DB.query<{ id: string, email: ValidEmail, password: HashedPassword, isVerified: boolean, scopes: UserScope[] }>(sql`
            SELECT id, email, password, "isVerified", scopes FROM public.users WHERE ${criteria}
        `);
        if (selectResult.rowCount === 0) {
            return undefined;
        }
        const model = onlyOne(selectResult.rows);
        return {
            id: Number(model.id),
            email: model.email,
            password: model.password,
            isVerified: model.isVerified,
            scopes: model.scopes,
        };
    }

    async insertSession(session: NewSessionSchema): Promise<SessionSchema> {
        const insertResult = await DB.query<{ id: string }>(sql`
            INSERT INTO public.user_sessions ("createdAt", "updatedAt", "userID", token, "tokenExpiresAt", "tokenScopes")
                VALUES (NOW(), NOW(), ${session.userID}, ${session.token}, ${session.tokenExpiresAt}, ${session.tokenScopes})
                RETURNING id
        `);
        const modelId = onlyOne(insertResult.rows).id;
        return {
            id: Number(modelId),
            userID: session.userID,
            token: session.token,
            tokenExpiresAt: session.tokenExpiresAt,
            tokenScopes: session.tokenScopes,
        };
    }

    async updateSession(session: SessionSchema): Promise<void> {
        const updateResult = await DB.query(sql`
            UPDATE public.user_sessions
                SET "updatedAt"     = NOW(),
                     token          = ${session.token},
                    "tokenExpiresAt = ${session.tokenExpiresAt},
                    "tokenScopes"   = ${session.tokenScopes}
                WHERE id = ${session.id} 
        `);
        if (updateResult.rowCount !== 1) {
            throw new UserSystemError('unknownSession', `Session <${session.id}> does not exist`);
        }
    }

    async deleteSession(sessionID: SessionID): Promise<void> {
        const deleteResult = await DB.query(sql`
            DELETE FROM public.user_sessions
                WHERE id = ${sessionID}
        `);
        if (deleteResult.rowCount !== 1) {
            throw new UserSystemError('unknownSession', `Session <${sessionID}> does not exist`);
        }
    }

    async getSession(sessionID: SessionID): Promise<SessionSchema | undefined> {
        const selectResult = await DB.query<{ id: string, userID: string, token: ValidToken, tokenExpiresAt: Date, tokenScopes: SessionTokenScope[] }>(sql`
            SELECT id, "userID", token, "tokenExpiresAt", "tokenScopes" FROM public.user_sessions WHERE id = ${sessionID}
        `);
        if (selectResult.rowCount === 0) {
            return undefined;
        }
        const row = onlyOne(selectResult.rows);
        return {
            id: Number(row.id),
            userID: Number(row.userID),
            token: row.token,
            tokenExpiresAt: row.tokenExpiresAt,
            tokenScopes: row.tokenScopes,
        };
    }

    async putSettings(settings: SettingSchema[]): Promise<void> {
        for (const { userID, name, value } of settings) {
            await DB.query(sql`
                WITH rows AS (
                    UPDATE public.user_settings
                        SET "updatedAt" = NOW(),
                             value      = ${value}
                        WHERE "userID" = ${userID} AND name = ${name}
                        RETURNING *
                )
                INSERT INTO public.user_settings ("userID", "createdAt", "updatedAt", name, value)
                    SELECT ${userID}, NOW(), NOW(), ${name}, ${value}
                    WHERE NOT EXISTS (SELECT 1 FROM rows)
            `);
        }
    }

    async deleteSettings(userID: UserID, names: SettingName[]): Promise<Set<SettingName>> {
        const deleteResult = await DB.query<{ name: SettingName }>(sql`
            DELETE from public.user_settings
                WHERE "userID" = ${userID},
                       name IN ${names}
                RETURNING name
        `);
        return new Set(map(deleteResult.rows, row => row.name));
    }

    async getSettings(userID: UserID, names: SettingName[]): Promise<SettingSchema[]> {
        const selectResult = await DB.query<{ userID: string, name: SettingName, value: string }>(sql`
            SELECT "userID", name, value
                FROM public.user_settings
                WHERE "userID" = ${userID} AND name in ${names}
        `);
        return selectResult.rows.map(row => ({
            userID: Number(row.userID),
            name: row.name,
            value: row.value,
        }));
    }
}
