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

import { Request, Response, Router } from "express";
import { GeocodeAddress, ReverseGeocodeAddress } from "fruit-company/maps";
import "i18next-http-middleware";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { DepsObject } from "../bootstrap/deps";

async function getSearchByQuery(
    { mapsToken }: Pick<DepsObject, 'mapsToken'>,
    req: Request<{ query: string }>,
    res: Response
): Promise<void> {
    // if (req.userAccount === undefined) {
    //     res.redirect(linkTo({ where: "signIn" }));
    //     return;
    // }
    const query = req.params.query;
    const language = req.i18n.resolvedLanguage ?? req.language;
    const geocodeAddress = new GeocodeAddress({ query, language });
    console.info(`GET /search perform(${geocodeAddress})`);
    const placeResults = await fulfill({
        authority: mapsToken,
        request: geocodeAddress,
    })

    res.set("Cache-Control", 'public, max-age=300');
    res.json(placeResults);
}

async function getSearchByCoordinates(
    { mapsToken }: Pick<DepsObject, 'mapsToken'>,
    req: Request<{ latitude: string, longitude: string }>,
    res: Response
): Promise<void> {
    // if (req.userAccount === undefined) {
    //     res.redirect(linkTo({ where: "signIn" }));
    //     return;
    // }
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = new LocationCoordinates(
        LocationCoordinates.parseCoordinate(req.params.latitude),
        LocationCoordinates.parseCoordinate(req.params.longitude),
    );
    const reverseGeocodeAddress = new ReverseGeocodeAddress({ location, language });
    console.info(`GET /search perform(${reverseGeocodeAddress})`);
    const placeResults = await fulfill({
        authority: mapsToken,
        request: reverseGeocodeAddress,
    });

    res.set("Cache-Control", 'public, max-age=300');
    res.json(placeResults);
}

export default function SearchRoutes(deps: Pick<DepsObject, 'mapsToken'>): Router {
    return Router()
        .get('/api/search/:query', async (req, res) => {
            await getSearchByQuery(deps, req, res);
        })
        .get('/api/search/:latitude/:longitude', async (req, res) => {
            await getSearchByCoordinates(deps, req, res);
        });
}
