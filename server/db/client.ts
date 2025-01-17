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

import { onlyOne } from "its-it/only-one";
import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import sql from "sql-template-tag";
import { env } from "../utilities/env";

export const DB = new pg.Client(env('DATABASE_URL'));
await DB.connect();
console.info("DB: Connected");

const result = await DB.query<{ exists: boolean }>(sql`
    SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND   tablename  = 'user_sessions'
    )
`);
if (!onlyOne(result.rows).exists) {
    console.info("DB: Initializing schema");
    const schemaPath = path.join(import.meta.dirname, `schema.sql`);
    const schema = await fs.readFile(schemaPath, { encoding: "utf8" });
    await DB.query(schema);
}
