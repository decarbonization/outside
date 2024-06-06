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

import { Attribution } from "../../fruit-company/weather/models/attribution";
import { Weather } from "../../fruit-company/weather/models/weather";
import { elementStyleFor } from "../styling/element-style";
import { DepsObject } from "../views/_deps";
import { PlaceSearch } from "../views/place-search";
import { WeatherDetails } from "../views/weather-details";
import { renderApp } from "./_app";

export interface RenderWeatherOptions {
    readonly deps: DepsObject;
    readonly query?: string;
    readonly disableSearch?: boolean;
    readonly weather: Weather;
    readonly attribution: Attribution;
}

export function renderWeather({ deps, query, disableSearch, weather, attribution }: RenderWeatherOptions): string {
    const className = elementStyleFor(weather.currentWeather?.conditionCode, weather.currentWeather?.daylight);
    return renderApp({ className, deps }, (
        <>
            <PlaceSearch query={query} disabled={disableSearch} />
            <WeatherDetails weather={weather} attribution={attribution} />
        </>
    ));
}
