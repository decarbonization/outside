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
import { allWeatherDataSets, parseWeather, WeatherQuery, WeatherToken } from "fruit-company/weather";
import fs from "fs/promises";
import path from "path";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { loadTheme } from "../styling/themes";
import { renderWeatherForecast } from "../templates/weather-forecast";
import { envInt } from "../utilities/env";
import { cacheControlFor, timezoneFor } from "../utilities/weather-utils";
import { DepsObject } from "../views/_deps";
import { linkDestination, linkTo } from "./_links";

// TODO: Currently limiting daily forecasts to 7 days because of
//       <https://forums.developer.apple.com/forums/thread/757910>.

export interface WeatherForecastRoutesOptions {
    readonly weatherToken: WeatherToken;
}

async function getWeatherForecast(
    { weatherToken }: WeatherForecastRoutesOptions,
    req: Request<{ country: string, latitude: string, longitude: string, locality: string }>,
    res: Response
): Promise<void> {
    const query = req.params.locality;
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = new LocationCoordinates(
        LocationCoordinates.parseCoordinate(req.params.latitude),
        LocationCoordinates.parseCoordinate(req.params.longitude),
    );
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
        dailyEnd: addDays(currentAsOf, envInt("DAILY_FORECAST_LIMIT", 7)),
        dailyStart: currentAsOf,
        dataSets: allWeatherDataSets,
        hourlyEnd: addHours(currentAsOf, envInt("HOURLY_FORECAST_LIMIT", 24)),
        hourlyStart: currentAsOf,
    });
    console.info(`GET /weather fulfill(${weatherQuery})`);
    const weather = await fulfill({
        authority: weatherToken,
        request: weatherQuery,
    });
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: timezone,
    };
    const link = linkDestination({
        where: "weather",
        countryCode,
        location,
        query,
        ref,
    });
    const resp = renderWeatherForecast({ deps, link, weather });
    res.set("Cache-Control", cacheControlFor(weather));
    res.type('html').send(resp);
}

async function getWeatherForecastSample(
    { }: WeatherForecastRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const rawWeather = await fs.readFile(path.join(__dirname, "wk-sample.json"), "utf-8");
    const weather = parseWeather(rawWeather);
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: "America/New_York",
    };
    const link = linkDestination({
        where: "weather",
        countryCode: "ZZ",
        location: new LocationCoordinates(0, 0),
        query: "!Sample",
    });
    const resp = renderWeatherForecast({ deps, link, searchDisabled: true, weather });
    res.set("Cache-Control", "no-store");
    res.type('html').send(resp);
}

export function WeatherForecastRoutes(options: WeatherForecastRoutesOptions): Router {
    return Router()
        .get('/weather/ZZ/0/0/!Sample', async (req, res) => {
            await getWeatherForecastSample(options, req, res);
        })
        .get('/weather/:country/:latitude/:longitude/:locality', async (req, res) => {
            await getWeatherForecast(options, req, res);
        })
        .get('/weather/:country/:latitude/:longitude', async (req, res) => {
            const query = req.query["q"] as string | undefined;
            const location = new LocationCoordinates(
                LocationCoordinates.parseCoordinate(req.params.latitude),
                LocationCoordinates.parseCoordinate(req.params.longitude),
            );
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
        .get('/weather/sample', async (_req, res) => {
            console.warn("This route is deprecated, prefer GET /weather/ZZ/0/0/!Sample");
            res.redirect('/weather/ZZ/0/0/!Sample');
        })
        .get('/sample', async (_req, res) => {
            console.warn("This route is deprecated, prefer GET /weather/sample");
            res.redirect('/weather/ZZ/0/0/!Sample');
        });
}
