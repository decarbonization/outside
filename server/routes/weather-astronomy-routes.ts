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
import { WeatherQuery, WeatherToken } from "fruit-company/weather";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { renderWeatherAstronomy } from "../templates/weather-astronomy";
import { proveString } from "../utilities/maybe";
import { cacheControlFor } from "../utilities/weather-utils";
import { makeDeps } from "../views/_deps";
import { linkDestination, linkTo } from "./_links";

export interface WeatherAstronomyRoutesOptions {
    readonly weatherToken: WeatherToken;
}

async function getWeatherAstronomy(
    { weatherToken }: WeatherAstronomyRoutesOptions,
    req: Request<{ country: string, latitude: string, longitude: string, locality: string }>,
    res: Response
): Promise<void> {
    if (req.userModel === undefined) {
        res.redirect(linkTo({ where: "signIn" }));
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
        dailyEnd: addDays(currentAsOf, 1),
        dailyStart: currentAsOf,
        dataSets: ['currentWeather', 'forecastDaily'],
    });
    console.info(`GET /weather/.../astronomy fulfill(${weatherQuery})`);
    const weather = await fulfill({
        authority: weatherToken,
        request: weatherQuery,
    });
    const link = linkDestination({
        where: "weather",
        tab: "astronomy",
        countryCode,
        location,
        query,
        ref,
    });
    const resp = renderWeatherAstronomy({ deps, link, weather });
    res.set("Cache-Control", cacheControlFor(weather));
    res.type('html').send(resp);
}

export function WeatherAstronomyRoutes(options: WeatherAstronomyRoutesOptions): Router {
    return Router()
        .get('/weather/:country/:latitude/:longitude/:locality/astronomy', async (req, res) => {
            await getWeatherAstronomy(options, req, res);
        });
}
