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

import { CurrentAirConditions } from "good-breathing/aqi";
import { PollenForecast } from "good-breathing/pollen";
import { LinkDestinationTo } from "../routes/_links";
import { DepsObject } from "../views/_deps";
import { ModeSelector } from "../views/mode-selector";
import { PlaceSearch } from "../views/place-search";
import { CurrentAirForecast } from "../views/weather-air/current-air-forecast";
import { renderApp } from "./_app";
import { PollenDailyForecast } from "../views/weather-air/pollen-daily-forecast";

export interface RenderWeatherAstronomyOptions {
    readonly deps: DepsObject;
    readonly disableSearch?: boolean;
    readonly link: LinkDestinationTo<"weather">;
    readonly airConditions?: CurrentAirConditions;
    readonly pollenForecast?: PollenForecast;
}

export function renderWeatherAir({ deps, link, disableSearch, airConditions, pollenForecast }: RenderWeatherAstronomyOptions): string {
    return renderApp({ deps }, (
        <>
            <PlaceSearch query={link.query} disabled={disableSearch} />
            <ModeSelector link={link} mode="air" />
            <CurrentAirForecast conditions={airConditions} />
            <PollenDailyForecast forecast={pollenForecast} />
        </>
    ));
}
