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

import { addDays, addHours, differenceInSeconds } from "date-fns";
import { Request, Response, Router } from "express";
import { Attribution, Weather, WeatherAttribution, WeatherQuery, WeatherToken, allWeatherDataSets, parseWeather } from "fruit-company";
import { fulfill } from "serene-front";
import { LocationCoordinates, truncateLocationCoordinates } from "serene-front/models";
import fs from "fs/promises";
import { find } from "geo-tz";
import path from "path";
import { loadTheme } from "../styling/themes";
import { renderWeather } from "../templates/weather";
import { coordinate } from "../utilities/converters";
import { envInt } from "../utilities/env";
import { AsyncStorage } from "../utilities/storage";
import { DepsObject } from "../views/_deps";
import { SearchRoutes } from "./search-routes";

// TODO: Currently limiting daily forecasts to 7 days because of
//       <https://forums.developer.apple.com/forums/thread/757910>.

const attributionFor = (() => {
    const cache = new Map<string, Attribution>();
    return async function (token: WeatherToken, language: string): Promise<Attribution> {
        const existingAttribution = cache.get(language);
        if (existingAttribution !== undefined) {
            return existingAttribution
        }
        const newAttribution = await fulfill({ authority: token, request: new WeatherAttribution({ language }) });
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
        dailyEnd: addDays(currentAsOf, envInt("DAILY_FORECAST_LIMIT", 8)),
        dailyStart: currentAsOf,
        dataSets: allWeatherDataSets,
        hourlyEnd: addHours(currentAsOf, envInt("HOURLY_FORECAST_LIMIT", 24)),
        hourlyStart: currentAsOf,
    });
    console.info(`GET /weather perform(${weatherQuery})`);
    const weather = await fulfill({
        authority: weatherToken,
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

async function getWeatherSample(
    { weatherToken }: WeatherRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const language = req.i18n.resolvedLanguage ?? req.language;
    const rawWeather = await fs.readFile(path.join(__dirname, "wk-sample.json"), "utf-8");
    const weather = parseWeather(rawWeather);
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
 * @param query The query used to find the location.
 * @param ref The optional referrer.
 * @returns A link suitable for embedding in an `a` tag.
 */
WeatherRoutes.linkToGetWeather = function (country: string, location: LocationCoordinates, query: string, ref?: string): string {
    const { latitude, longitude } = truncateLocationCoordinates(location, 3);
    let link = `/weather/${encodeURIComponent(country)}/${latitude}/${longitude}/${encodeURIComponent(query)}`;
    if (ref !== undefined) {
        link += `?ref=${encodeURIComponent(ref)}`;
    }
    return link;
};

/**
 * Create a link to the weather demo page.
 * 
 * @returns A link suitable for embedding in an `a` tag.
 */
WeatherRoutes.linkToGetWeatherDemo = function (): string {
    return "/weather/demo";
}
