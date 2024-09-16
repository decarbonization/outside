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

import { Request } from "express";
import i18next, { i18n } from "i18next";
import { createContext } from "preact";
import { LocationCoordinates } from "serene-front/data";
import { emptyTheme, loadTheme, Theme } from "../styling/themes";
import { mapIfNotUndefined } from "../utilities/maybe";
import { timezoneFor } from "../utilities/weather-utils";

/**
 * Encapsulates the dependencies made available to components in this app.
 */
export interface DepsObject {
    /**
     * The internationalization object.
     */
    readonly i18n: i18n;

    /**
     * The currently active theme.
     */
    readonly theme: Theme;

    /**
     * The currently active time zone 
     */
    readonly timeZone: string;
}

/**
 * Options for the `makeDeps` function.
 */
export interface MakeDepsOptions {
    /**
     * The request the dependencies are being created for.
     */
    readonly req: Request<any, any, any, any, any>;

    /**
     * The location the request was made for.
     */
    readonly location?: LocationCoordinates;
}

/**
 * Create a dependencies object for a view template.
 */
export async function makeDeps({ req, location }: MakeDepsOptions): Promise<DepsObject> {
    const { themeName, timeZone } = await req.prefs.get("themeName", "timeZone");
    return {
        i18n: req.i18n,
        theme: await loadTheme(themeName),
        timeZone: timeZone ?? mapIfNotUndefined(location, timezoneFor) ?? "UTC",
    };
}

/**
 * Dependencies made available to components in this app.
 */
export const Deps = createContext<DepsObject>({
    i18n: i18next,
    theme: emptyTheme,
    timeZone: "UTC",
});
