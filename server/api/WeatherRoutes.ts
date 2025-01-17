/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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
import { allWeatherDataSets, WeatherQuery } from "fruit-company/weather";
import { GetCurrentAirConditions } from "good-breathing/aqi";
import "i18next-http-middleware";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { DepsObject } from "../bootstrap/deps";
import "../middleware/AccountMiddleware";
import { envInt } from "../utilities/env";
import { cacheControlFor, timezoneFor } from "../utilities/weather-utils";

// TODO: Currently limiting daily forecasts to 7 days because of
//       <https://forums.developer.apple.com/forums/thread/757910>.

async function getWeather(
    { weatherToken }: Pick<DepsObject, 'weatherToken'>,
    req: Request<{ country: string, latitude: string, longitude: string }>,
    res: Response
): Promise<void> {
    if (req.userAccount === undefined) {
        res.status(401).json({ message: "Not signed in" });
        return;
    }
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = new LocationCoordinates(
        LocationCoordinates.parseCoordinate(req.params.latitude),
        LocationCoordinates.parseCoordinate(req.params.longitude),
    );
    const countryCode = req.params.country;
    const timezone = timezoneFor(location);
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

    res.set("Cache-Control", cacheControlFor(weather));
    res.json(weather);
}

async function getAirConditions(
    { gMapsApiKey }: Pick<DepsObject, 'gMapsApiKey'>,
    req: Request<{ country: string, latitude: string, longitude: string }>,
    res: Response
): Promise<void> {
    if (req.userAccount === undefined) {
        res.status(401).json({ message: "Not signed in" });
        return;
    }
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = new LocationCoordinates(
        LocationCoordinates.parseCoordinate(req.params.latitude),
        LocationCoordinates.parseCoordinate(req.params.longitude),
    );
    const airQualityQuery = new GetCurrentAirConditions({
        location,
        languageCode: language,
    })
    console.info(`GET /weather fulfill(${airQualityQuery})`);
    const airConditions = await fulfill({
        authority: gMapsApiKey,
        request: airQualityQuery,
    });

    res.set("Cache-Control", 'public, max-age=300');
    res.json(airConditions);
}

export default function WeatherRoutes(deps: Pick<DepsObject, 'gMapsApiKey' | 'weatherToken'>): Router {
    return Router()
        .get('/api/weather/:country/:latitude/:longitude/', async (req, res) => {
            await getWeather(deps, req, res);
        })
        .get('/api/air/:country/:latitude/:longitude/', async (req, res) => {
            await getAirConditions(deps, req, res);
        });
}
