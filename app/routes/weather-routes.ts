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
import { Router } from "express";
import fs from "fs/promises";
import { find } from "geo-tz";
import path from "path";
import { perform } from "../../fruit-company/api";
import { LocationCoordinates } from "../../fruit-company/maps/models/base";
import { Weather } from "../../fruit-company/weather/models/weather";
import { WeatherQuery, WeatherToken, allWeatherDataSets } from "../../fruit-company/weather/weather-api";
import { loadTheme } from "../styling/themes";
import { renderWeather } from "../templates/weather";
import { AsyncStorage } from "../utilities/storage";
import { DepsObject } from "../views/_deps";
import { coordinate } from "../utilities/converters";

function timezoneFor({ latitude, longitude }: LocationCoordinates): string {
    const timezones = find(latitude, longitude);
    if (timezones.length === 0) {
        throw new Error(`No time zone found for { ${latitude}, ${longitude} }`);
    }
    return timezones[0];
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

const demo = {
    cities: [
        { country: "JP", location: { latitude: 35.689506, longitude: 139.6917 }, query: "Tokyo" },
        { country: "IN", location: { latitude: 28.6439255, longitude: 77.09298 }, query: "Delhi" },
        { country: "CN", location: { latitude: 31.2203102, longitude: 121.4623931 }, query: "Shanghai" },
        { country: "BR", location: { latitude: -23.5796404, longitude: -46.6550645 }, query: "São Paulo" },
        { country: "MX", location: { latitude: 19.4301054, longitude: -99.1336074 }, query: "Mexico City" },
        { country: "EG", location: { latitude: 30.0214489, longitude: 31.4904086 }, query: "Cairo" },
        { country: "US", location: { latitude: 40.7129822, longitude: -74.007205 }, query: "New York" },
    ],

    get city() {
        return this.cities[Math.floor(Math.random() * this.cities.length)];
    },

    async load(localStorage: AsyncStorage): Promise<Weather | undefined> {
        const rawWeather = await localStorage.getItem("weather:demo");
        if (rawWeather === undefined) {
            return undefined;
        }
        const weather = await parseWeather(rawWeather);
        const fetchTime = weather.currentWeather?.asOf;
        const latitude = weather.currentWeather?.metadata.latitude;
        const longitude = weather.currentWeather?.metadata.longitude;
        if (fetchTime === undefined || latitude === undefined || longitude === undefined) {
            console.warn("Existing demo weather data is corrupt");
            return undefined;
        }

        if (differenceInHours(new Date(), fetchTime) > 24) {
            console.info("Existing demo weather data has expired");
            return undefined;
        }

        return weather;
    },

    async save(weather: Weather, localStorage: AsyncStorage): Promise<void> {
        const rawWeather = JSON.stringify(weather);
        await localStorage.setItem("weather:demo", rawWeather);
        console.info("Updated weather demo data");
    },

    queryFor(weather: Weather): string | undefined {
        // This is kind of gross, but it compensates for WeatherKit returning
        // geo coordinates that don't match what's passed to it. Our demo cities
        // data set is closed and fully controlled so this should be fine.
        const latitude = weather.currentWeather?.metadata.latitude ?? 0;
        return demo.cities.find(({ location }) => Math.floor(location.latitude) === Math.floor(latitude))?.query;
    },
};

export interface WeatherRoutesOptions {
    readonly weatherToken: WeatherToken;
    readonly localStorage: AsyncStorage;
}

export function WeatherRoutes({ weatherToken, localStorage }: WeatherRoutesOptions): Router {
    return Router()
        .get('/weather/:country/:latitude/:longitude', async (req, res) => {
            const deps: DepsObject = {
                i18n: req.i18n,
                theme: await loadTheme(),
            };
            const query = req.query["q"] as string | undefined;
            const language = req.i18n.resolvedLanguage ?? req.language;
            const location = {
                latitude: coordinate(req.params.latitude),
                longitude: coordinate(req.params.longitude),
            };
            const timezone = timezoneFor(location);
            const countryCode = req.params.country;
            const currentAsOf = new Date();
            const weatherCall = new WeatherQuery({
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
            });
            console.info(`GET /weather perform(${weatherCall})`);
            const weather = await perform({
                token: weatherToken,
                call: weatherCall,
            });
            const resp = renderWeather({ deps, query, weather });
            res.type('html').send(resp);
        })
        .get('/weather/demo', async (req, res) => {
            const deps: DepsObject = {
                i18n: req.i18n,
                theme: await loadTheme(),
            };
            let weather = await demo.load(localStorage);
            if (weather === undefined) {
                const demoCity = demo.city;
                const language = req.i18n.resolvedLanguage ?? req.language;
                const location = demoCity.location;
                const timezone = timezoneFor(location);
                const countryCode = demoCity.country;
                const currentAsOf = new Date();
                const weatherCall = new WeatherQuery({
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
                });
                console.info(`GET /weather/demo perform(${weatherCall})`);
                weather = await perform({
                    token: weatherToken,
                    call: weatherCall,
                });
                await demo.save(weather, localStorage);
            }
            const query = demo.queryFor(weather);
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
