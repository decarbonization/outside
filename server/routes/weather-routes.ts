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

import { addDays, addHours } from "date-fns";
import { Request, Response, Router } from "express";
import { WeatherQuery, WeatherToken, allWeatherDataSets, parseWeather } from "fruit-company";
import fs from "fs/promises";
import path from "path";
import { fulfill } from "serene-front";
import { loadTheme } from "../styling/themes";
import { renderWeather } from "../templates/weather";
import { coordinate } from "../utilities/converters";
import { envInt } from "../utilities/env";
import { attributionFor, cacheControlFor, timezoneFor } from "../utilities/weather-utils";
import { DepsObject } from "../views/_deps";
import { linkTo } from "./_links";

// TODO: Currently limiting daily forecasts to 7 days because of
//       <https://forums.developer.apple.com/forums/thread/757910>.

export interface WeatherRoutesOptions {
    readonly weatherToken: WeatherToken;
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
    const ref = req.query["ref"] as string | undefined;
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
    const link = {
        where: "weather" as const,
        countryCode,
        location,
        query,
        ref,
    };
    const resp = renderWeather({ deps, link, weather, attribution });
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
    const link = {
        where: "weather" as const,
        countryCode: "US",
        location: {
            latitude: weather.currentWeather!.metadata.latitude,
            longitude: weather.currentWeather!.metadata.longitude,
        },
        query: "!Sample",
    };
    const resp = renderWeather({ deps, link, weather, attribution });
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
                const ref = req.query["ref"] as string | undefined;
                res.redirect(linkTo({ where: "weather", countryCode, location, query, ref }));
            } else {
                // Redirect links without a locality
                res.redirect(linkTo({ where: "searchByCoordinates", location }));
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
