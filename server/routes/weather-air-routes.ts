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

import { minutesToSeconds } from "date-fns";
import { Request, Response, Router } from "express";
import * as fs from "fs/promises";
import { GoogleMapsApiKey } from 'good-breathing';
import { allExtraComputations, ExtraComputation, GetCurrentAirConditions, parseCurrentAirConditions } from 'good-breathing/aqi';
import { GetPollenForecast, parsePollenForecast } from 'good-breathing/pollen';
import * as path from "path";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { loadTheme } from "../styling/themes";
import { renderWeatherAir } from "../templates/weather-air";
import { envInt } from "../utilities/env";
import { timezoneFor } from "../utilities/weather-utils";
import { DepsObject } from "../views/_deps";
import { linkDestination } from "./_links";
import { remove } from "serene-front/collections";

export interface WeatherAirRoutesOptions {
    readonly gMapsApiKey: GoogleMapsApiKey;
}

async function getWeatherAir(
    { gMapsApiKey }: WeatherAirRoutesOptions,
    req: Request<{ country: string, latitude: string, longitude: string, locality: string }>,
    res: Response
): Promise<void> {
    const query = req.params.locality;
    const languageCode = req.i18n.resolvedLanguage ?? req.language;
    const location = new LocationCoordinates(
        LocationCoordinates.parseCoordinate(req.params.latitude),
        LocationCoordinates.parseCoordinate(req.params.longitude),
    );
    const timezone = timezoneFor(location);
    const countryCode = req.params.country;
    const ref = req.query["ref"] as string | undefined;

    const getAirConditions = new GetCurrentAirConditions({
        location,
        languageCode,
        extraComputations: remove(allExtraComputations, ExtraComputation.localAqi),
    });
    const getPollenForecast = new GetPollenForecast({
        location,
        languageCode,
        days: envInt("DAILY_POLLEN_FORECAST_LIMIT", 3),
    });
    console.info(`GET /weather/.../air fulfill(${getAirConditions}), fulfill(${getPollenForecast})`);
    const [airConditions, pollenForecast] = await Promise.all([
        fulfill({ request: getAirConditions, authority: gMapsApiKey }),
        fulfill({ request: getPollenForecast, authority: gMapsApiKey }),
    ]);

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
    const resp = renderWeatherAir({ deps, link, airConditions, pollenForecast });
    res.set("Cache-Control", `public, max-age=${minutesToSeconds(5)}`);
    res.type('html').send(resp);
}

async function getWeatherAirSample(
    { }: WeatherAirRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const rawAirConditions = await fs.readFile(path.join(__dirname, "aqi-sample.json"), "utf-8");
    const airConditions = parseCurrentAirConditions(rawAirConditions);
    const rawPollenForecast = await fs.readFile(path.join(__dirname, "pollen-sample.json"), "utf-8");
    const pollenForecast = parsePollenForecast(rawPollenForecast);

    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: "America/New_York",
    };
    const link = linkDestination({
        where: "weather",
        sub: "air",
        countryCode: "ZZ",
        location: new LocationCoordinates(0, 0),
        query: "!Sample",
    });
    const resp = renderWeatherAir({ deps, link, searchDisabled: true, airConditions, pollenForecast });
    res.set("Cache-Control", "no-store");
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
