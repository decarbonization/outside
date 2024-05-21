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

import i18next, { i18n } from "i18next";
import { createContext } from "preact";
import { Theme } from "../styling/themes";

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
}

/**
 * Dependencies made available to components in this app.
 */
export const Deps = createContext({
    i18n: i18next,
    theme: { name: "", links: [], icons: {} },
} as DepsObject);
