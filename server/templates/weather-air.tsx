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

import { LinkDestinationTo } from "../routes/_links";
import { DepsObject } from "../views/_deps";
import { ModeSelector } from "../views/mode-selector";
import { PlaceSearch } from "../views/place-search";
import { renderApp } from "./_app";

export interface RenderWeatherAstronomyOptions {
    readonly deps: DepsObject;
    readonly disableSearch?: boolean;
    readonly link: LinkDestinationTo<"weather">;
}

export function renderWeatherAir({ deps, link, disableSearch }: RenderWeatherAstronomyOptions): string {
    return renderApp({ deps }, (
        <>
            <PlaceSearch query={link.query} disabled={disableSearch} />
            <ModeSelector link={link} mode="air" />
        </>
    ));
}
