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

import fs from "fs/promises";
import path from "path";
import { MoonPhase, WeatherCondition } from "../../fruit-company/weather/models/base";
import { DynamicClassName } from "./dynamic-class-name";

/**
 * Encapsulates decorative elements found in a weather forecast.
 */
export const enum WeatherDecoration {
    /**
     * A decoration indicating a measurement is limited to the day.
     */
    daytime = "daytime",
    
    /**
     * A decoration indicating a measurement is limited to the night.
     */
    overnight = "overnight",

    /**
     * A decoration indicating a measurement is trending upward over time.
     */
    trendUp = "trendUp",

    /**
     * A decoration indicating a measurement is trending downward over time.
     */
    trendDown = "trendDown",
}

/**
 * An object which provides CSS class names for weather conditions, 
 * moon phases, and decorative elements in a weather forecast.
 */
export type ThemeIcons = {
    /**
     * Look up the class name for an element in a weather forecast.
     */
    readonly [P in WeatherCondition | MoonPhase | WeatherDecoration]?: DynamicClassName;
}

/**
 * Encapsulates a link for a resource in a theme.
 */
export interface ThemeLink {
    /**
     * The type of the link.
     */
    readonly rel: "preconnect" | "stylesheet";

    /**
     * The resource of the link.
     */
    readonly href: string;

    /**
     * Whether the resource should be loaded using cross-origin semantics.
     */
    readonly crossorigin?: boolean;
}

/**
 * Encapsulates customizable styling for the app.
 */
export interface Theme {
    /**
     * The name of the theme.
     */
    readonly name: string;

    /**
     * A short description of the theme.
     */
    readonly description?: string;

    /**
     * The links which import the theme's resources.
     */
    readonly links: ThemeLink[];

    /**
     * The icons provided by the theme.
     */
    readonly icons: ThemeIcons;
}

/**
 * The location of the themes in the app.
 */
const themesDirectory = path.join(
    __dirname, 
    "..", // app
    "..",  // outside
    "public", 
    "themes"
);

/**
 * The path of the default theme.
 */
const defaultTheme = path.join(themesDirectory, "flat");

/**
 * Find the paths for every available theme.
 * 
 * @returns An array of paths for each theme available to the app.
 */
export async function availableThemes(): Promise<string[]> {
    return (await fs.readdir(themesDirectory))
        .map(themeDirectory => path.join(themesDirectory, themeDirectory));
}

/**
 * Load a single theme.
 * 
 * @param themePath The path for a theme available to the app.
 * @returns A theme ready to be used by the app.
 */
export async function loadTheme(themePath?: string): Promise<Theme> {
    const manifestPath = path.join(themePath ?? defaultTheme, "manifest.json");
    const manifestBuffer = await fs.readFile(manifestPath);
    return JSON.parse(manifestBuffer.toString("utf8")) as Theme;
}
