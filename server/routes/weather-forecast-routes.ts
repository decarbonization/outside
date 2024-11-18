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
import { allWeatherDataSets, WeatherQuery, WeatherToken } from "fruit-company/weather";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { renderWeatherForecast } from "../templates/weather-forecast";
import { envInt } from "../utilities/env";
import { proveString } from "../utilities/maybe";
import { cacheControlFor } from "../utilities/weather-utils";
import { makeDeps } from "../views/_deps";
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
    if (req.userModel === undefined) {
        res.redirect(linkTo({ where: "login" }));
        return;
    }
    const query = req.params.locality;
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = new LocationCoordinates(
        LocationCoordinates.parseCoordinate(req.params.latitude),
        LocationCoordinates.parseCoordinate(req.params.longitude),
    );
    const countryCode = req.params.country;
    const ref = proveString(req.query["ref"]);
    const deps = await makeDeps({ req, location });
    const currentAsOf = new Date();
    const weatherQuery = new WeatherQuery({
        language,
        location,
        timezone: deps.timeZone,
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
    const link = linkDestination({
        where: "weather",
        tab: "forecast",
        countryCode,
        location,
        query,
        ref,
    });
    const resp = renderWeatherForecast({ deps, link, weather });
    res.set("Cache-Control", cacheControlFor(weather));
    res.type('html').send(resp);
}

export function WeatherForecastRoutes(options: WeatherForecastRoutesOptions): Router {
    return Router()
        .get('/weather/:country/:latitude/:longitude/:locality', async (req, res) => {
            await getWeatherForecast(options, req, res);
        })
        .get('/weather/:country/:latitude/:longitude', async (req, res) => {
            const query = proveString(req.query["q"]);
            const location = new LocationCoordinates(
                LocationCoordinates.parseCoordinate(req.params.latitude),
                LocationCoordinates.parseCoordinate(req.params.longitude),
            );
            if (query !== undefined) {
                // Redirect legacy weather links
                const countryCode = req.params.country;
                const ref = proveString(req.query["ref"]);
                res.redirect(linkTo({ where: "weather", tab: "forecast", countryCode, location, query, ref }));
            } else {
                // Redirect links without a locality
                res.redirect(linkTo({ where: "searchByCoordinates", location }));
            }
        });
}
