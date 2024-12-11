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

import express, { Router } from 'express';
import { MapsToken } from 'fruit-company/maps';
import { WeatherToken } from 'fruit-company/weather';
import { GoogleMapsApiKey } from 'good-breathing';
import { MailtrapClient } from 'mailtrap';
import { UserSystem } from '../accounts/system';
import { ErrorMiddleware } from '../middlewares/error-middleware';
import { AccountRoutes } from './account-routes';
import { IndexRoutes } from './index-routes';
import { SearchRoutes } from './search-routes';
import { WeatherForecastRoutes } from './weather-forecast-routes';

export interface AllRoutesOptions {
    readonly userSystem: UserSystem;
    readonly mailer: MailtrapClient;
    readonly mapsToken: MapsToken;
    readonly weatherToken: WeatherToken;
    readonly gMapsApiKey: GoogleMapsApiKey;
    readonly staticDir: string;
}

export function routes({
    userSystem,
    mailer,
    mapsToken,
    weatherToken,
    gMapsApiKey,
    staticDir,
}: AllRoutesOptions): Router {
    return Router()
        .use(IndexRoutes({}))
        .use(AccountRoutes({ userSystem, mailer }))
        .use(SearchRoutes({ mapsToken }))
        .use(WeatherForecastRoutes({ weatherToken, gMapsApiKey }))
        .use(express.static(staticDir))
        .use(ErrorMiddleware({})); //< Must come last!
}
