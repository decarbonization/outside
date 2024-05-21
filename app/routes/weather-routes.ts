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

import { addDays, addHours, differenceInHours } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { Router } from "express";
import { existsSync } from "fs";
import fs from "fs/promises";
import { find } from "geo-tz";
import path from "path";
import { perform } from "../../fruit-company/api";
import { LocationCoordinates } from "../../fruit-company/maps/models/base";
import { Weather } from "../../fruit-company/weather/models/weather";
import { WeatherQuery, WeatherToken, allWeatherDataSets } from "../../fruit-company/weather/weather-api";
import { loadTheme } from "../styling/themes";
import { renderWeather } from "../templates/weather";
import { DepsObject } from "../views/_deps";

function timezoneFor({ latitude, longitude }: LocationCoordinates): string {
    const timezones = find(latitude, longitude);
    if (timezones.length === 0) {
        throw new Error(`No time zone found for { ${latitude}, ${longitude} }`);
    }
    return timezones[0];
}

function nowIn(timezone: string): Date {
    return toZonedTime(new Date(), timezone);
}

async function parseWeather(rawWeather: string): Promise<Weather> {
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
    return await fakeWeatherQuery.parse(weatherResponse);
}

const demoFilename = "weather-demo.json";
const demoCities = [
    { country: "JP", location: { latitude: 35.689506, longitude: 139.6917 }, query: "Tokyo" },
    { country: "IN", location: { latitude: 28.6439255, longitude: 77.09298 }, query: "Delhi" },
    { country: "CN", location: { latitude: 31.2203102, longitude: 121.4623931 }, query: "Shanghai" },
    { country: "BR", location: { latitude: -23.5796404, longitude: -46.6550645 }, query: "São Paulo" },
    { country: "MX", location: { latitude: 19.4301054, longitude: -99.1336074 }, query: "Mexico City" },
    { country: "EG", location: { latitude: 30.0214489, longitude: 31.4904086 }, query: "Cairo" },
    { country: "US", location: { latitude: 40.7129822, longitude: -74.007205 }, query: "New York" },
];

async function loadDemo(persistentDir: string): Promise<Weather | undefined> {
    const demoPath = path.join(persistentDir, demoFilename);
    if (!existsSync(demoPath)) {
        console.info("No existing demo weather data to load");
        return undefined;
    }
    const rawDemoWeather = await fs.readFile(demoPath, "utf-8");
    const demoWeather = await parseWeather(rawDemoWeather);
    const fetchTime = demoWeather.currentWeather?.asOf;
    const latitude = demoWeather.currentWeather?.metadata.latitude;
    const longitude = demoWeather.currentWeather?.metadata.longitude;
    if (fetchTime === undefined || latitude === undefined || longitude === undefined) {
        console.warn("Existing demo weather data is corrupt");
        return undefined;
    }

    const timeZone = find(latitude, longitude)[0];
    if (timeZone === undefined) {
        console.error(`Could not find time zone for { ${latitude}, ${longitude} }`);
        return undefined;
    }

    const localFetchTime = fromZonedTime(fetchTime, timeZone);
    if (differenceInHours(localFetchTime, new Date()) > 24) {
        console.info("Existing demo weather data has expired");
        return undefined;
    }

    return demoWeather;
}

async function writeDemo(persistentDir: string, demo: Weather): Promise<void> {
    const demoPath = path.join(persistentDir, demoFilename);
    const rawDemo = JSON.stringify(demo);
    await fs.writeFile(demoPath, rawDemo);
    console.info("Updated weather demo data");
}

function demoQueryFor(weather: Weather): string | undefined {
    // This is kind of gross, but it compensates for WeatherKit returning
    // geo coordinates that don't match what's passed to it. Our demo cities
    // data set is closed and fully controlled so this should be fine.
    const latitude = weather.currentWeather?.metadata.latitude ?? 0;
    return demoCities.find(({ location }) => Math.floor(location.latitude) === Math.floor(latitude))?.query;
}

export interface WeatherRoutesOptions {
    readonly persistentDir: string;
    readonly weatherToken: WeatherToken;
}

export function WeatherRoutes({ persistentDir, weatherToken }: WeatherRoutesOptions): Router {
    return Router()
        .get('/weather/:country/:latitude/:longitude', async (req, res) => {
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
            const timezone = timezoneFor(location);
            const countryCode = req.params.country;
            const currentAsOf = nowIn(timezone);
            const weather = await perform({
                token: weatherToken, call: new WeatherQuery({
                    language,
                    location,
                    timezone,
                    countryCode,
                    currentAsOf,
                    dailyEnd: addDays(currentAsOf, 10),
                    dailyStart: currentAsOf,
                    dataSets: allWeatherDataSets,
                    hourlyEnd: addHours(currentAsOf, 30),
                    hourlyStart: currentAsOf,
                })
            });
            const resp = renderWeather({ deps, query, weather });
            res.type('html').send(resp);
        })
        .get('/weather/demo', async (req, res) => {
            const deps: DepsObject = {
                i18n: req.i18n,
                theme: await loadTheme(),
            };
            let weather = await loadDemo(persistentDir);
            if (weather === undefined) {
                const demoCity = demoCities[Math.floor(Math.random() * demoCities.length)];
                const language = req.i18n.resolvedLanguage ?? req.language;
                const location = demoCity.location;
                const timezone = timezoneFor(location);
                const countryCode = demoCity.country;
                const currentAsOf = nowIn(timezone);
                weather = await perform({
                    token: weatherToken, call: new WeatherQuery({
                        language,
                        location,
                        timezone,
                        countryCode,
                        currentAsOf,
                        dailyEnd: addDays(currentAsOf, 10),
                        dailyStart: currentAsOf,
                        dataSets: allWeatherDataSets,
                        hourlyEnd: addHours(currentAsOf, 30),
                        hourlyStart: currentAsOf,
                    })
                });
                await writeDemo(persistentDir, weather);
            }
            const query = demoQueryFor(weather);
            const resp = renderWeather({ deps, query, disableSearch: true, weather });
            res.type('html').send(resp);
        })
        .get('/sample', async (req, res) => {
            const deps: DepsObject = {
                i18n: req.i18n,
                theme: await loadTheme(),
            };
            const rawWeather = await fs.readFile(path.join(__dirname, "..", "..", "wk-sample.json"), "utf-8");
            const weather = await parseWeather(rawWeather);
            const resp = renderWeather({ deps, weather });
            res.type('html').send(resp);
        });
}
