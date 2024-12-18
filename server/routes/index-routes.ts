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
import renderIndex from "../templates/index";
import { proveString } from "../utilities/maybe";
import { makeDeps } from "../components/_deps";

export interface IndexRoutesOptions {
}

async function getIndex(
    { }: IndexRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const searchQuery = proveString(req.query["q"]);
    const deps = await makeDeps({ req });
    const resp = renderIndex({ deps, searchQuery });
    res.type('html').send(resp);
}

async function getAppWebManifest(
    { }: IndexRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const { i18n } = await makeDeps({ req });
    const resp = JSON.stringify({
        "name": i18n.t("appName"),
        "short_name": i18n.t("appName"),
        "start_url": ".",
        "display": "standalone",
        "theme_color": "blue",
        "description": i18n.t("appDescription"),
        "icons": [
            {
                "src": "/image/icon.png",
                "sizes": "128x128",
                "type": "image/png"
            },
            {
                "src": "/image/icon@2x.png",
                "sizes": "256x256",
                "type": "image/png"
            },

            {
                "src": "/image/icon@3x.png",
                "sizes": "384x384",
                "type": "image/png"
            }
        ],
    });
    res.type('application/manifest+json').send(resp);
}

export function IndexRoutes(options: IndexRoutesOptions): Router {
    return Router()
        .get('/', async (req, res) => {
            await getIndex(options, req, res);
        })
        .get('/app.webmanifest', async (req, res) => {
            await getAppWebManifest(options, req, res);
        });
}
