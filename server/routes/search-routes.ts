import { Request, Response, Router } from "express";
import { GeocodeAddress, MapsToken, ReverseGeocodeAddress } from "fruit-company";
import { fulfill } from "serene-front";
import { coordinate } from "../utilities/converters";
import { linkTo } from "./_links";

export interface SearchRoutesOptions {
    readonly mapsToken: MapsToken;
}

async function getSearchByQuery(
    { mapsToken }: SearchRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const query = req.query["q"];
    if (query === undefined || typeof query !== 'string') {
        res.redirect(linkTo({ where: "index" }));
        return;
    }

    const language = req.i18n.resolvedLanguage ?? req.language;
    const ref = req.query["ref"] as string | undefined;
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
    const language = req.i18n.resolvedLanguage ?? req.language;
    const location = {
        latitude: coordinate(req.params.latitude),
        longitude: coordinate(req.params.longitude),
    };
    const ref = req.query["ref"] as string | undefined;
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
