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

import { i18n } from "i18next";

export interface FormatListOptions {
    readonly i18n: i18n;
    readonly autoCapitalize?: boolean;
}

export function formatList(strings: string[], { i18n, autoCapitalize = false }: FormatListOptions): string {
    if (strings.length === 0) {
        return "";
    } else if (strings.length === 1) {
        return strings[0]
    } else {
        const joiner = i18n.t('units:listJoiner');
        let accumulator = "";
        const lastIndex = strings.length - 1;
        for (let index = 0; index < lastIndex; index++) {
            if (index > 0) {
                accumulator += joiner;
            }
            accumulator += getPrepared(strings, lastIndex, { i18n, autoCapitalize });
        }
        accumulator += i18n.t('units:listFinalizer');
        accumulator += getPrepared(strings, lastIndex, { i18n, autoCapitalize });
        return accumulator;
    }
}

function getPrepared(strings: string[], index: number, { i18n, autoCapitalize }: FormatListOptions): string {
    if (autoCapitalize && index > 0) {
        return strings[index].toLocaleLowerCase(i18n.language).trim();
    } else {
        return strings[index].trim();
    }
}
