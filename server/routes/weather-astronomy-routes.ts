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
import { WeatherToken } from "fruit-company";
import { loadTheme } from "../styling/themes";
import { renderIndex } from "../templates";
import { DepsObject } from "../views/_deps";

export interface WeatherAstronomyRoutesOptions {
    readonly weatherToken: WeatherToken;
}

async function getWeatherAstronomy(
    { }: WeatherAstronomyRoutesOptions,
    req: Request<{ country: string, latitude: string, longitude: string, locality: string }>,
    res: Response
): Promise<void> {
    const query = req.query["q"] as string | undefined;
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: "UTC",
    };
    const resp = renderIndex({ deps, query });
    res.type('html').send(resp);
}

export function WeatherAstronomyRoutes(options: WeatherAstronomyRoutesOptions): Router {
    return Router()
        .get('/weather/:country/:latitude/:longitude/:locality/astronomy', async (req, res) => {
            await getWeatherAstronomy(options, req, res);
        });
}