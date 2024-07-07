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
import { perform } from "fruit-company";
import { AirNowToken } from "../air-now/api/air-now-token";
import { AirQualityForecastQuery, CurrentAirQualityQuery } from "../air-now/api/queries";
import { loadTheme } from "../styling/themes";
import { renderAirQuality } from "../templates/air-quality";
import { coordinate } from "../utilities/converters";
import { DepsObject } from "../views/_deps";

async function getAirQuality(
    { airNowToken }: AirQualityRoutesOptions,
    req: Request<{ country: string, latitude: string, longitude: string, locality: string }>,
    res: Response
): Promise<void> {
    const query = req.params.locality;
    const location = {
        latitude: coordinate(req.params.latitude),
        longitude: coordinate(req.params.longitude),
    };

    const [current, forecast] = await Promise.all([
        perform({
            token: airNowToken,
            request: new CurrentAirQualityQuery({ location }),
        }),
        perform({
            token: airNowToken,
            request: new AirQualityForecastQuery({ location }),
        })
    ]);
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: current.timeZone,
    };
    const resp = renderAirQuality({ deps, query, current, forecast });
    res.type('html').send(resp);
}

export interface AirQualityRoutesOptions {
    readonly airNowToken: AirNowToken;
}

export function AirQualityRoutes(options: AirQualityRoutesOptions): Router {
    return Router()
        .get('/weather/:country/:latitude/:longitude/:locality/air-quality', async (req, res) => {
            await getAirQuality(options, req, res);
        })
}
