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

import { Router } from "express";
import { perform } from "../../fruit-company/api";
import { GeocodeAddress, MapsToken } from "../../fruit-company/maps/maps-api";
import { loadTheme } from "../styling/themes";
import { renderIndex } from "../templates";
import { DepsObject } from "../views/_deps";

export interface IndexRoutesOptions {
    readonly mapsToken: MapsToken;
}

export function IndexRoutes({ mapsToken }: IndexRoutesOptions): Router {
    return Router()
        .get('/', async (req, res) => {
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

            const resp = renderIndex({ deps, query, results });
            res.type('html').send(resp);
        });
}
