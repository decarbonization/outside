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

import { Request, Response, Router } from "express";
import { loadTheme } from "../styling/themes";
import { renderWeatherAir } from "../templates/weather-air";
import { coordinate } from "../utilities/converters";
import { timezoneFor } from "../utilities/weather-utils";
import { DepsObject } from "../views/_deps";
import { linkDestination } from "./_links";

export interface WeatherAirRoutesOptions {
}

async function getWeatherAir(
    { }: WeatherAirRoutesOptions,
    req: Request<{ country: string, latitude: string, longitude: string, locality: string }>,
    res: Response
): Promise<void> {
    const query = req.params.locality;
    const location = {
        latitude: coordinate(req.params.latitude),
        longitude: coordinate(req.params.longitude),
    };
    const timezone = timezoneFor(location);
    const countryCode = req.params.country;
    const ref = req.query["ref"] as string | undefined;
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
    const resp = renderWeatherAir({ deps, link });
    res.type('html').send(resp);
}

async function getWeatherAirSample(
    { }: WeatherAirRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: "America/New_York",
    };
    const link = linkDestination({
        where: "weather",
        sub: "astronomy",
        countryCode: "ZZ",
        location: {
            latitude: 0,
            longitude: 0,
        },
        query: "!Sample",
    });
    const resp = renderWeatherAir({ deps, link });
    res.type('html').send(resp);
}

export function WeatherAirRoutes(options: WeatherAirRoutesOptions): Router {
    return Router()
        .get('/weather/ZZ/0/0/!Sample/air', async (req, res) => {
            await getWeatherAirSample(options, req, res);
        })
        .get('/weather/:country/:latitude/:longitude/:locality/air', async (req, res) => {
            await getWeatherAir(options, req, res);
        });
}
