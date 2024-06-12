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

import { addDays, addHours, differenceInHours, differenceInSeconds } from "date-fns";
import { Request, Response, Router } from "express";
import { Attribution, LocationCoordinates, Weather, WeatherAttribution, WeatherQuery, WeatherToken, allWeatherDataSets, perform, truncateLocationCoordinates } from "fruit-company";
import fs from "fs/promises";
import { find } from "geo-tz";
import path from "path";
import { loadTheme } from "../styling/themes";
import { renderWeather } from "../templates/weather";
import { coordinate } from "../utilities/converters";
import { env } from "../utilities/env";
import { AsyncStorage } from "../utilities/storage";
import { DepsObject } from "../views/_deps";
import { SearchRoutes } from "./search-routes";

const attributionFor = (() => {
    const cache = new Map<string, Attribution>();
    return async function (token: WeatherToken, language: string): Promise<Attribution> {
        const existingAttribution = cache.get(language);
        if (existingAttribution !== undefined) {
            return existingAttribution
        }
        const newAttribution = await perform({ token, request: new WeatherAttribution({ language }) });
        cache.set(language, newAttribution);
        return newAttribution;
    }
})();

function timezoneFor({ latitude, longitude }: LocationCoordinates): string {
    const timezones = find(latitude, longitude);
    if (timezones.length === 0) {
        throw new Error(`No time zone found for { ${latitude}, ${longitude} }`);
    }
    return timezones[0];
}

function cacheControlFor(weather: Weather): string {
    const metadata = weather.currentWeather?.metadata;
    if (metadata === undefined) {
        return "no-cache";
    }
    const { readTime, expireTime } = metadata;
    const maxAge = differenceInSeconds(expireTime, readTime);
    return `public, max-age=${maxAge}`;
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

    cityFor(weather: Weather) {
        // This is kind of gross, but it compensates for WeatherKit returning
        // geo coordinates that don't match what's passed to it. Our demo cities
        // data set is closed and fully controlled so this should be fine.
        const latitude = weather.currentWeather?.metadata.latitude ?? 0;
        return demo.cities.find(({ location }) => Math.floor(location.latitude) === Math.floor(latitude));
    },
};

export interface WeatherRoutesOptions {
    readonly weatherToken: WeatherToken;
    readonly localStorage: AsyncStorage;
}

async function getWeather(
    { weatherToken }: WeatherRoutesOptions,
    req: Request<{ country: string, latitude: string, longitude: string, locality: string }>,
    res: Response
): Promise<void> {
    const query = req.params.locality;
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = {
        latitude: coordinate(req.params.latitude),
        longitude: coordinate(req.params.longitude),
    };
    const timezone = timezoneFor(location);
    const countryCode = req.params.country;
    const currentAsOf = new Date();
    const weatherQuery = new WeatherQuery({
        language,
        location,
        timezone,
        countryCode,
        currentAsOf,
        dailyEnd: addDays(currentAsOf, 10),
        dailyStart: currentAsOf,
        dataSets: allWeatherDataSets,
        hourlyEnd: addHours(currentAsOf, parseInt(env("HOURLY_FORECAST_LIMIT", "12"), 10)),
        hourlyStart: currentAsOf,
    });
    console.info(`GET /weather perform(${weatherQuery})`);
    const weather = await perform({
        token: weatherToken,
        request: weatherQuery,
    });
    const attribution = await attributionFor(weatherToken, language);
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: timezone,
    };
    const resp = renderWeather({ deps, query, weather, attribution });
    res.set("Cache-Control", cacheControlFor(weather));
    res.type('html').send(resp);
}

async function getWeatherDemo(
    { weatherToken, localStorage }: WeatherRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const language = req.i18n.resolvedLanguage ?? req.language;
    let weather = await demo.load(localStorage);
    if (weather === undefined) {
        const demoCity = demo.city;
        const location = demoCity.location;
        const timezone = timezoneFor(location);
        const countryCode = demoCity.country;
        const currentAsOf = new Date();
        const weatherQuery = new WeatherQuery({
            language,
            location,
            timezone,
            countryCode,
            currentAsOf,
            dailyEnd: addDays(currentAsOf, 10),
            dailyStart: currentAsOf,
            dataSets: allWeatherDataSets,
            hourlyEnd: addHours(currentAsOf, parseInt(env("HOURLY_FORECAST_LIMIT", "12"), 10)),
            hourlyStart: currentAsOf,
        });
        console.info(`GET /weather/demo perform(${weatherQuery})`);
        weather = await perform({
            token: weatherToken,
            request: weatherQuery,
        });
        await demo.save(weather, localStorage);
    }
    const demoCity = demo.cityFor(weather);
    const attribution = await attributionFor(weatherToken, language);
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: demoCity !== undefined ? timezoneFor(demoCity.location) : "UTC",
    };
    const resp = renderWeather({ deps, query: demoCity?.query, disableSearch: true, weather, attribution });
    res.type('html').send(resp);
}

async function getWeatherSample(
    { weatherToken }: WeatherRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const language = req.i18n.resolvedLanguage ?? req.language;
    const rawWeather = await fs.readFile(path.join(__dirname, "wk-sample.json"), "utf-8");
    const weather = await parseWeather(rawWeather);
    const attribution = await attributionFor(weatherToken, language);
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: "America/New_York",
    };
    const resp = renderWeather({ deps, weather, attribution });
    res.set("Cache-Control", "no-store");
    res.type('html').send(resp);
}

export function WeatherRoutes(options: WeatherRoutesOptions): Router {
    return Router()
        .get('/weather/:country/:latitude/:longitude/:locality', async (req, res) => {
            await getWeather(options, req, res);
        })
        .get('/weather/:country/:latitude/:longitude', async (req, res) => {
            const query = req.query["q"] as string | undefined;
            const location = {
                latitude: coordinate(req.params.latitude),
                longitude: coordinate(req.params.longitude),
            };
            if (query !== undefined) {
                // Redirect legacy weather links
                const countryCode = req.params.country;
                res.redirect(WeatherRoutes.linkToGetWeather(countryCode, location, query));
            } else {
                // Redirect links without a locality
                res.redirect(SearchRoutes.linkToGetSearchByCoordinates(location));
            }
        })
        .get('/weather/demo', async (req, res) => {
            await getWeatherDemo(options, req, res);
        })
        .get('/weather/sample', async (req, res) => {
            await getWeatherSample(options, req, res);
        })
        .get('/sample', async (req, res) => {
            console.warn("This route is deprecated, prefer GET /weather/sample");
            res.redirect('/weather/sample');
        });
}

/**
 * Create a link to a weather page.
 * 
 * @param country The country the forecast data originates from.
 * @param location The location to find forecast data for.
 * @param query The optional query used to find the location.
 * @returns A link suitable for embedding in an `a` tag.
 */
WeatherRoutes.linkToGetWeather = function (country: string, location: LocationCoordinates, query: string): string {
    const { latitude, longitude } = truncateLocationCoordinates(location, 3);
    return `/weather/${encodeURIComponent(country)}/${latitude}/${longitude}/${encodeURIComponent(query)}`;
};

/**
 * Create a link to the weather demo page.
 * 
 * @returns A link suitable for embedding in an `a` tag.
 */
WeatherRoutes.linkToGetWeatherDemo = function (): string {
    return "/weather/demo";
}
