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
import { GeocodeAddress, MapsToken, ReverseGeocodeAddress } from "fruit-company/maps";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { proveString } from "../utilities/maybe";
import { linkTo } from "./_links";

export interface SearchRoutesOptions {
    readonly mapsToken: MapsToken;
}

async function getSearchByQuery(
    { mapsToken }: SearchRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    if (req.uid === undefined) {
        res.redirect(linkTo({ where: "login" }));
        return;
    }
    const query = req.query["q"];
    if (query === undefined || typeof query !== 'string') {
        res.redirect(linkTo({ where: "index" }));
        return;
    }

    const language = req.i18n.resolvedLanguage ?? req.language;
    const ref = proveString(req.query["ref"]);
    const geocodeAddress = new GeocodeAddress({ query, language });
    console.info(`GET /search perform(${geocodeAddress})`);
    const { results } = await fulfill({
        authority: mapsToken,
        request: geocodeAddress,
    })
    if (results.length === 0) {
        res.redirect(linkTo({ where: "index", query }));
    } else {
        const place = results[0];
        res.redirect(linkTo({
            where: "weather",
            tab: "forecast",
            countryCode: place.countryCode,
            location: place.coordinate,
            query: place.structuredAddress.locality,
            ref,
        }));
    }
}

async function getSearchByCoordinates(
    { mapsToken }: SearchRoutesOptions,
    req: Request<{ latitude: string, longitude: string }>,
    res: Response
): Promise<void> {
    if (req.uid === undefined) {
        res.redirect(linkTo({ where: "login" }));
        return;
    }
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = new LocationCoordinates(
        LocationCoordinates.parseCoordinate(req.params.latitude),
        LocationCoordinates.parseCoordinate(req.params.longitude),
    );
    const ref = proveString(req.query["ref"]);
    const reverseGeocodeAddress = new ReverseGeocodeAddress({ location, language });
    console.info(`GET /search perform(${reverseGeocodeAddress})`);
    const { results } = await fulfill({
        authority: mapsToken,
        request: reverseGeocodeAddress,
    });
    if (results.length === 0) {
        res.redirect(linkTo({ where: "index", query: `${location.latitude}, ${location.longitude}` }));
    } else {
        const place = results[0];
        res.redirect(linkTo({
            where: "weather",
            tab: "forecast",
            countryCode: place.countryCode,
            location: place.coordinate,
            query: place.structuredAddress.locality,
            ref,
        }));
    }
}

export function SearchRoutes(options: SearchRoutesOptions): Router {
    return Router()
        .get('/search', async (req, res) => {
            await getSearchByQuery(options, req, res);
        })
        .get('/search/:latitude/:longitude', async (req, res) => {
            await getSearchByCoordinates(options, req, res);
        });
}
