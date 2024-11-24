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

import { Options, Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { env } from '../utilities/env';
import { UserModel } from './models/user';
import { SettingModel } from './models/setting';
import { SessionModel } from './models/session';

export function initDB(): Sequelize {
    // NOTE: Must swap out how ssl mode is specified to support DigitalOcean.
    //       See <https://github.com/sequelize/sequelize/issues/10015>.
    const databaseURL = new URL(env('DATABASE_URL'));
    if (databaseURL.searchParams.get("sslmode") === "require") {
        databaseURL.searchParams.delete("sslmode");
        databaseURL.searchParams.set("ssl", "true");
    }
    const options: Options<PostgresDialect> = {
        url: databaseURL.href,
        dialect: PostgresDialect,
        models: [UserModel, SessionModel, SettingModel],
    };
    if (databaseURL.searchParams.get("ssl") === "true") {
        options.ssl = {
            rejectUnauthorized: false
        };
    }
    const sequelize = new Sequelize(options);
    (async () => {
        try {
            await sequelize.authenticate();
        } catch (error) {
            console.error(`Could not authenticate DB:`, error);
            process.exit(1);
        }
        try {
            await sequelize.sync({ alter: true });
        } catch (error) {
            console.log(`Could not sync models with DB:`, error);
            process.exit(1);
        }
    })();
    return sequelize;
}
