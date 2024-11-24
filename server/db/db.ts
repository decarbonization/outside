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

import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { env } from '../utilities/env';
import { UserModel } from './models/user';
import { SettingModel } from './models/setting';
import { SessionModel } from './models/session';

export function initDB(): Sequelize {
    const sequelize = new Sequelize({
        url: env('SQL_SERVER'),
        dialect: PostgresDialect,
        models: [UserModel, SessionModel, SettingModel],
    });
    (async () => {
        try {
            await sequelize.authenticate();
        } catch (error) {
            console.error(`Could not authenticate DB:`, error);
            process.exit(1);
        }
        try {
            await sequelize.sync();
        } catch (error) {
            console.log(`Could not sync models with DB:`, error);
            process.exit(1);
        }
    })();
    return sequelize;
}
