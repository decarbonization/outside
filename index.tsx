/*
 * outside weather app
 * Copyright (C) 2014  Peter "Kevin" Contreras
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

import dotenv from 'dotenv';
import express from 'express';
import "express-async-errors";
import fs from "fs";
import i18next from "i18next";
import i18nextBackend, { FsBackendOptions } from 'i18next-fs-backend';
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";
import { ErrorMiddleware } from './app/middlewares/error-middleware';
import { IndexRoutes } from './app/routes/index-routes';
import { WeatherRoutes } from './app/routes/weather-routes';
import { MapsToken } from './fruit-company/maps/maps-api';
import { WeatherToken } from './fruit-company/weather/weather-api';
import { env } from './app/utilities/env';

dotenv.config();

process.on('unhandledRejection', (reason: Error | any) => {
    console.log(`Unhandled Rejection: ${reason.message || reason}`);

    throw new Error(reason.message || reason);
});

const localesDir = path.join(__dirname, "locales");
const privateDir = path.join(__dirname, "private");
const publicDir = path.join(__dirname, "public");

i18next
    .use(i18nextBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init<FsBackendOptions>({
        preload: ['en-US'],
        fallbackLng: 'en-US',
        ns: ['outside', 'units'],
        defaultNS: 'outside',
        backend: {
            loadPath: path.join(localesDir, '{{lng}}', '{{ns}}.json'),
        },
    });

const mapsToken = new MapsToken(
    env("APPLE_MAPS_APP_ID"),
    env("APPLE_TEAM_ID"),
    env("APPLE_MAPS_KEY_ID"),
    fs.readFileSync(path.join(privateDir, env("APPLE_MAPS_KEY_NAME"))),
);
const weatherToken = new WeatherToken(
    env("APPLE_WEATHER_APP_ID"),
    env("APPLE_TEAM_ID"),
    env("APPLE_WEATHER_KEY_ID"),
    fs.readFileSync(path.join(privateDir, env("APPLE_WEATHER_KEY_NAME"))),
);

const app = express();

app.use('/locales', express.static(localesDir));
app.use(i18nextMiddleware.handle(i18next));

app.use(IndexRoutes({ mapsToken }));
app.use(WeatherRoutes({ weatherToken }));
app.use(express.static(publicDir));

// Must come last!
app.use(ErrorMiddleware({}));

const port = process.env.PORT ?? 8000;
app.listen(port, () => {
    console.log(`Proxy is running at http://localhost:${port} from ${__dirname}`);
});
