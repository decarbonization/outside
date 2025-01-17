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

import { ifNotUndef } from "its-it/nullable";
import { LinkDestination, linkTo } from "../../src/routes/_links";

export { linkTo } from "../../src/routes/_links";
export type { LinkDestination } from "../../src/routes/_links";

export function fullyQualifiedLinkTo(destination: LinkDestination): string {
    const base = ifNotUndef(process.env["HOST"], host => `https://${host}`)
        ?? `http://localhost:${envInt("PORT", 8000)}`;
    const link = linkTo(destination);
    return `${base}${link}`;
}
