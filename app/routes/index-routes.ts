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
