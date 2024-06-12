import { Request, Response, Router } from "express";
import { GeocodeAddress, LocationCoordinates, MapsToken, ReverseGeocodeAddress, perform } from "fruit-company";
import { coordinate } from "../utilities/converters";
import { IndexRoutes } from "./index-routes";
import { WeatherRoutes } from "./weather-routes";

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
        res.redirect(IndexRoutes.getIndex());
        return;
    }

    const language = req.i18n.resolvedLanguage ?? req.language;
    const geocodeAddress = new GeocodeAddress({ query, language });
    console.info(`GET /search perform(${geocodeAddress})`);
    const { results } = await perform({
        token: mapsToken,
        request: geocodeAddress,
    })
    if (results.length === 0) {
        res.redirect(IndexRoutes.getIndex(query));
    } else {
        const place = results[0];
        res.redirect(WeatherRoutes.linkToGetWeather(place.countryCode, place.coordinate, place.structuredAddress.locality));
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
    const reverseGeocodeAddress = new ReverseGeocodeAddress({ location, language });
    console.info(`GET /search perform(${reverseGeocodeAddress})`);
    const { results } = await perform({
        token: mapsToken,
        request: reverseGeocodeAddress,
    });
    if (results.length === 0) {
        res.redirect(IndexRoutes.getIndex(`${location.latitude}, ${location.longitude}`));
    } else {
        const place = results[0];
        res.redirect(WeatherRoutes.linkToGetWeather(place.countryCode, location, place.structuredAddress.locality));
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

SearchRoutes.linkToGetSearchByQuery = function (query?: string): string {
    let link = "/search";
    if (query !== undefined) {
        link += `?q=${encodeURIComponent(query)}`;
    }
    return link;
};

SearchRoutes.linkToGetSearchByCoordinates = function ({ latitude, longitude }: LocationCoordinates): string {
    return `/search/${latitude}/${longitude}`;
}
