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

import { hoursToSeconds } from "date-fns";
import { Request, Response, Router } from "express";
import { perform } from "../../fruit-company/api";
import { GeocodeAddress, MapsToken } from "../../fruit-company/maps/maps-api";
import { loadTheme } from "../styling/themes";
import { renderIndex } from "../templates";
import { DepsObject } from "../views/_deps";
import { WeatherRoutes } from "./weather-routes";

export interface IndexRoutesOptions {
    readonly mapsToken: MapsToken;
}

async function getIndex(
    { mapsToken }: IndexRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: "UTC",
    };
    const query = req.query["q"] as string | undefined;
    const results = query !== undefined
        ? await perform({
            token: mapsToken,
            call: new GeocodeAddress({ query, language: req.i18n.resolvedLanguage })
        })
        : undefined;
    if (results !== undefined && results.results.length === 1 && req.query["noredirect"] === undefined) {
        const onlyPlace = results.results[0];
        const weatherLink = WeatherRoutes.linkToGetWeather(onlyPlace.countryCode, onlyPlace.coordinate, onlyPlace.name);
        res.redirect(weatherLink);
    } else {
        const resp = renderIndex({ deps, query, results });
        if (query !== undefined) {
            res.set("Cache-Control", `public, max-age=${hoursToSeconds(24)}`);
        }
        res.type('html').send(resp);
    }
}

export function IndexRoutes(options: IndexRoutesOptions): Router {
    return Router()
        .get('/', async (req, res) => {
            await getIndex(options, req, res);
        });
}

IndexRoutes.getIndex = function (): string {
    return "/";
}
