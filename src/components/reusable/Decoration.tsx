/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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
import { i18n } from "i18next";
import { icon, IconOptions, IconPack } from "../../styling/icon-pack";
import { useDeps } from "../../hooks/Deps";

export type DecorationIconName =
    | 'daytime'
    | 'overnight';

const decorationIcons: IconPack<DecorationIconName> = {
    "base": {
        "day": "wi fill day",
        "night": "wi fill night"
    },
    "daytime": "clear-day",
    "overnight": "starry-night",
};

export interface DecorationProps {
    readonly className?: string;
    readonly name: DecorationIconName;
}

export default function Decoration({ className, name }: DecorationProps) {
    const { i18n } = useDeps();
    const iconClassName = icon(decorationIcons, { name });
    const iconDescription = decorationIconDescription(i18n, { name });
    if (iconClassName !== undefined) {
        return (
            <span
                className={classNames("icon", className, iconClassName)}
                role="img"
                aria-label={iconDescription} />
        );
    } else {
        return (
            <span className={classNames("icon-fallback", className)}>
                {iconDescription}
            </span>
        );
    }
}

/**
 * Get a description of an icon from a theme.
 * 
 * @param i18n The internationalization object to get strings from.
 * @param options The options specifying what icon to get.
 * @returns A human readable string.
 */
function decorationIconDescription(i18n: i18n, { name }: IconOptions<DecorationIconName>): string | undefined {
    switch (name) {
        case 'daytime':
            return i18n.t("forecast.measurementLabels.daytime");
        case 'overnight':
            return i18n.t("forecast.measurementLabels.overnight");
        default:
            return undefined;
    }
}
