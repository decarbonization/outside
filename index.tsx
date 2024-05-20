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

import { addDays, addHours } from 'date-fns';
import dotenv from 'dotenv';
import express from 'express';
import fs from "fs";
import { find } from 'geo-tz';
import i18next from "i18next";
import i18nextBackend, { FsBackendOptions } from 'i18next-fs-backend';
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";
import { loadTheme } from './app/styling/themes';
import { renderIndex } from './app/templates';
import { renderWeather } from './app/templates/weather';
import { DepsObject } from './app/views/_deps';
import { perform } from './fruit-company/api';
import { GeocodeAddress, MapsToken } from './fruit-company/maps/maps-api';
import { Weather } from "./fruit-company/weather/models/weather";
import { WeatherDataSet, WeatherQuery, WeatherToken } from './fruit-company/weather/weather-api';

dotenv.config();

i18next
    .use(i18nextBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init<FsBackendOptions>({
        preload: ['en-US'],
        fallbackLng: 'en-US',
        ns: ['outside', 'units'],
        defaultNS: 'outside',
        backend: {
            loadPath: path.join(__dirname, 'locales', '{{lng}}', '{{ns}}.json'),
        },
    });

const app = express();
const mapsToken = new MapsToken(
    process.env.APPLE_MAPS_APP_ID!,
    process.env.APPLE_TEAM_ID!,
    process.env.APPLE_MAPS_KEY_ID!,
    fs.readFileSync(path.join(__dirname, "private", process.env.APPLE_MAPS_KEY_NAME!)),
);
const weatherToken = new WeatherToken(
    process.env.APPLE_WEATHER_APP_ID!,
    process.env.APPLE_TEAM_ID!,
    process.env.APPLE_WEATHER_KEY_ID!,
    fs.readFileSync(path.join(__dirname, "private", process.env.APPLE_WEATHER_KEY_NAME!)),
);

app.use(express.static(path.join(__dirname, "public")));
app.use('/locales', express.static(path.join(__dirname, 'locales')));
app.use(i18nextMiddleware.handle(i18next));

app.get('/', async (req, res) => {
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
    };
    const query = req.query["q"] as string | undefined;
    const results = query !== undefined
        ? await perform({
            token: mapsToken,
            call: new GeocodeAddress({ query: query, language: req.i18n.resolvedLanguage })
        })
        : undefined;

    const resp = renderIndex({ deps, query, results });
    res.type('html').send(resp);
});

app.get('/weather/:country/:latitude/:longitude', async (req, res) => {
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
    };
    const query = req.query["q"] as string | undefined;
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = {
        latitude: Number(req.params.latitude),
        longitude: Number(req.params.longitude),
    };
    const timezone = find(location.latitude, location.longitude)[0];
    const countryCode = req.params.country;
    const currentAsOf = new Date();
    const weather = await perform({
        token: weatherToken, call: new WeatherQuery({
            language,
            location,
            timezone,
            countryCode,
            currentAsOf,
            dailyEnd: addDays(currentAsOf, 10),
            dailyStart: currentAsOf,
            dataSets: [
                WeatherDataSet.currentWeather,
                WeatherDataSet.forecastDaily,
                WeatherDataSet.forecastHourly,
                WeatherDataSet.forecastNextHour,
                WeatherDataSet.weatherAlerts,
            ],
            hourlyEnd: addHours(currentAsOf, 30),
            hourlyStart: currentAsOf,
        })
    });
    const resp = renderWeather({ deps, query, weather });
    res.type('html').send(resp);
});

app.get('/sample', async (req, res) => {
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
    };
    const rawWeather = fs.readFileSync(path.join(__dirname, "wk-sample.json"), "utf-8");
    const weatherResponse = new Response(rawWeather, {
        headers: {},
        status: 200,
        statusText: "OK",
    });
    const fakeWeatherQuery = new WeatherQuery({
        language: "none", 
        location: { latitude: 0, longitude: 0 }, 
        timezone: "nowhere",
    });
    const weather = await fakeWeatherQuery.parse(weatherResponse);
    const resp = renderWeather({ deps, weather });
    res.type('html').send(resp);
});

const port = process.env.PORT ?? 8000;
app.listen(port, () => {
    console.log(`Proxy is running at http://localhost:${port} from ${__dirname}`);
});