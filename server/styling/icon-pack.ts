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

import classNames from "classnames";

/**
 * Encapsulates an icon.
 * 
 * An icon may either be a simple class name, 
 * or an object which specifies variants to use 
 * depending on certain conditions.
 */
export type Icon =
    | string
    | { day: string, night: string };

/**
 * Resolve an icon into a class name.
 * 
 * @param icon The icon to resolve.
 * @param daylight Whether the icon represents a day or night condition.
 * @returns An icon class name.
 */
export function resolveIcon(icon: Icon | undefined, daylight: boolean): string | undefined {
    if (icon === undefined) {
        return undefined;
    }
    if (typeof icon === 'string') {
        return icon;
    } else {
        if (daylight) {
            return icon.day;
        } else {
            return icon.night;
        }
    }
}

/**
 * An object which provides CSS class names for icons.
 */
export type IconPack<Name extends string> =
    & { readonly base?: Icon }
    & { readonly [N in Name]: Icon };

/**
 * The options to use when getting an icon from a pack.
 */
export interface IconOptions<Name extends string> {
    /**
     * The name of the icon.
     */
    readonly name: Name;

    /**
     * Whether the icon will be used in a daylight context.
     */
    readonly daylight?: boolean;
}

/**
 * Get an icon class name from a pack.
 * 
 * @param pack The pack to get an icon from.
 * @param options The options specifying what icon to get.
 * @returns An icon class name matching the given options.
 */
export function icon<Name extends string>(pack: IconPack<Name>, { name, daylight = true }: IconOptions<Name>): string | undefined {
    const base = pack["base"];
    const icon = pack[name];
    return classNames(
        resolveIcon(base, daylight),
        resolveIcon(icon, daylight)
    );
}
