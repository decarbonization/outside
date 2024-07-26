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
import { loadTheme } from "../styling/themes";
import { renderIndex } from "../templates";
import { DepsObject } from "../views/_deps";

export interface IndexRoutesOptions {
}

async function getIndex(
    { }: IndexRoutesOptions,
    req: Request,
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

async function getAppWebManifest(
    { }: IndexRoutesOptions,
    req: Request,
    res: Response
): Promise<void> {
    const deps: DepsObject = {
        i18n: req.i18n,
        theme: await loadTheme(),
        timeZone: "UTC",
    };
    const resp = JSON.stringify({
        "name": deps.i18n.t("appName"),
        "short_name": deps.i18n.t("appName"),
        "start_url": ".",
        "display": "standalone",
        "background_color": deps.theme.appBackgroundColor,
        "theme_color": deps.theme.appAccentColor,
        "description": deps.i18n.t("appDescription"),
        "icons": deps.theme.appIcons,
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
