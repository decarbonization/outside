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

import { addDays } from "date-fns";
import { Request, Response, Router } from "express";
import { parseWeather, WeatherDataSet, WeatherQuery, WeatherToken } from "fruit-company/weather";
import fs from "fs/promises";
import path from "path";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { loadTheme } from "../styling/themes";
import { renderWeatherAstronomy } from "../templates/weather-astronomy";
import { attributionFor, cacheControlFor, timezoneFor } from "../utilities/weather-utils";
import { DepsObject } from "../views/_deps";
import { linkDestination } from "./_links";

export interface WeatherAstronomyRoutesOptions {
    readonly weatherToken: WeatherToken;
}

async function getWeatherAstronomy(
    { weatherToken }: WeatherAstronomyRoutesOptions,
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
        dailyEnd: addDays(currentAsOf, 1),
        dailyStart: currentAsOf,
        dataSets: [WeatherDataSet.currentWeather, WeatherDataSet.forecastDaily],
    });
    console.info(`GET /weather/.../astronomy perform(${weatherQuery})`);
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
    const link = linkDestination({
        where: "weather",
        countryCode,
        location,
        query,
        ref,
    });
    const resp = renderWeatherAstronomy({ deps, link, weather, attribution });
    res.set("Cache-Control", cacheControlFor(weather));
    res.type('html').send(resp);
}

async function getWeatherAstronomySample(
    { weatherToken }: WeatherAstronomyRoutesOptions,
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
    const link = linkDestination({
        where: "weather",
        sub: "astronomy",
        countryCode: "ZZ",
        location: new LocationCoordinates(0, 0),
        query: "!Sample",
    });
    const resp = renderWeatherAstronomy({ deps, link, weather, attribution });
    res.set("Cache-Control", "no-store");
    res.type('html').send(resp);
}

export function WeatherAstronomyRoutes(options: WeatherAstronomyRoutesOptions): Router {
    return Router()
        .get('/weather/ZZ/0/0/!Sample/astronomy', async (req, res) => {
            await getWeatherAstronomySample(options, req, res);
        })
        .get('/weather/:country/:latitude/:longitude/:locality/astronomy', async (req, res) => {
            await getWeatherAstronomy(options, req, res);
        });
}
