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

import { SessionData, Store } from "express-session";
import { onlyOne } from "its-it/only-one";
import sql from "sql-template-tag";
import { DB } from "../db/client";

export class ClientSessionStore extends Store {
    override get(sid: string, callback: (err: any, session?: SessionData | null) => void): void {
        (async () => {
            try {
                const selectResult = await DB.query<{ data: any }>(sql`
                    SELECT data FROM public.client_sessions
                        WHERE id = ${sid}
                `);
                if (selectResult.rowCount === 0) {
                    callback(null, null);
                } else {
                    const data = onlyOne(selectResult.rows).data;
                    callback(null, data);
                }
            } catch (err) {
                callback(err, null);
            }
        })();
    }

    override set(sid: string, session: SessionData, callback?: (err?: any) => void): void {
        (async () => {
            try {
                await DB.query(sql`
                    WITH rows AS (
                        UPDATE public.client_sessions
                            SET "updatedAt" = NOW(),
                                 data       = ${session}
                            WHERE id = ${sid}
                            RETURNING *
                    )
                    INSERT INTO public.client_sessions (id, "createdAt", "updatedAt", data)
                        SELECT ${sid}, NOW(), NOW(), ${session}
                        WHERE NOT EXISTS (SELECT 1 FROM rows)
                `);
                callback?.(null);
            } catch (err) {
                callback?.(err);
            }
        })();
    }

    override destroy(sid: string, callback?: (err?: any) => void): void {
        (async () => {
            try {
                await DB.query(sql`
                    DELETE from public.client_sessions
                        WHERE id = ${sid}
                `);
                callback?.(null);
            } catch (err) {
                callback?.(err);
            }
        })();
    }

    override all(callback: (err: any, obj?: SessionData[] | { [sid: string]: SessionData; } | null) => void): void {
        (async () => {
            try {
                const selectResult = await DB.query<{ id: string, data: any }>(sql`
                    SELECT id, data FROM public.client_sessions
                `);
                const sessions: Record<string, SessionData> = {};
                for (const model of selectResult.rows) {
                    sessions[model.id] = model.data;
                }
                callback(null, sessions);
            } catch (err) {
                callback(err);
            }
        })();
    }

    override length(callback: (err: any, length?: number) => void): void {
        (async () => {
            try {
                const selectResult = await DB.query<{ count: string }>(sql`
                    SELECT count(*) FROM public.client_sessions
                `);
                const count = Number(onlyOne(selectResult.rows).count);
                callback(null, count);
            } catch (err) {
                callback(err);
            }
        })();
    }

    override clear(callback?: (err?: any) => void): void {
        (async () => {
            try {
                await DB.query(sql`
                    DELETE FROM public.client_sessions
                `);
                callback?.(null);
            } catch (err) {
                callback?.(err);
            }
        })();
    }
}
