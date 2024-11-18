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

import dotenv from 'dotenv';
import express from 'express';
import "express-async-errors";
import session from "express-session";
import { MapsToken } from 'fruit-company/maps';
import { WeatherToken } from 'fruit-company/weather';
import { GoogleMapsApiKey } from 'good-breathing';
import http from "http";
import { createHttpTerminator } from 'http-terminator';
import i18next from "i18next";
import i18nextBackend, { FsBackendOptions } from 'i18next-fs-backend';
import i18nextMiddleware from "i18next-http-middleware";
import { MailtrapClient } from "mailtrap";
import path from "path";
import { InMemoryUserStore } from './accounts/in-memory-store';
import { UserSystem } from './accounts/system';
import { accountMiddleware } from './middlewares/account-middleware';
import { ErrorMiddleware } from './middlewares/error-middleware';
import { IndexRoutes } from './routes/index-routes';
import { SearchRoutes } from './routes/search-routes';
import { UserRoutes } from './routes/user-routes';
import { WeatherAirRoutes } from './routes/weather-air-routes';
import { WeatherAstronomyRoutes } from './routes/weather-astronomy-routes';
import { WeatherForecastRoutes } from './routes/weather-forecast-routes';
import { env } from './utilities/env';
import { setUpShutDownHooks } from './utilities/shut-down';

dotenv.config();

process.on('unhandledRejection', (reason: Error | any) => {
    console.log(`Unhandled Rejection: ${reason.message || reason}`);

    throw new Error(reason.message || reason);
});

const localesDir = path.join(__dirname, "..", "locales");
const staticDir = path.join(__dirname, "..", "static");

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
    env("APPLE_MAPS_KEY"),
);
const weatherToken = new WeatherToken(
    env("APPLE_WEATHER_APP_ID"),
    env("APPLE_TEAM_ID"),
    env("APPLE_WEATHER_KEY_ID"),
    env("APPLE_WEATHER_KEY"),
);
const gMapsApiKey = new GoogleMapsApiKey(
    env("GOOGLE_MAPS_API_KEY"),
)
const userSystem = new UserSystem({
    store: new InMemoryUserStore(),
    salts: env("SALTS").split(","),
});
const mailer = new MailtrapClient({
    token: env("MAILTRAP_API_KEY"),
});

const app = express();

app.use('/locales', express.static(localesDir));
app.use(i18nextMiddleware.handle(i18next));
app.use(session({
    secret: env("SESSION_SECRETS").split(","),
    resave: true,
    saveUninitialized: true,
}));
app.use(accountMiddleware({ userSystem }));

app.use(IndexRoutes({}));
app.use(UserRoutes({ userSystem, mailer }))
app.use(SearchRoutes({ mapsToken }));
app.use(WeatherForecastRoutes({ weatherToken }));
app.use(WeatherAstronomyRoutes({ weatherToken }));
app.use(WeatherAirRoutes({ gMapsApiKey }));
app.use(express.static(staticDir));

// Must come last!
app.use(ErrorMiddleware({}));

const server = http.createServer(app);
const httpTerminator = createHttpTerminator({
    server,
});

const port = process.env.PORT ?? 8000;
server.listen(port, () => {
    console.log(`outside is running at http://${env('HOST', 'localhost')}:${port} from ${__dirname}`);
});

setUpShutDownHooks({ server, httpTerminator });
