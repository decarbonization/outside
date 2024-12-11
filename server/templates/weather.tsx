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

import { Weather } from "fruit-company/weather";
import { CurrentAirConditions } from "good-breathing/aqi";
import { LinkDestinationTo } from "../routes/_links";
import { elementStyleFor } from "../styling/element-style";
import { DepsObject } from "../views/_deps";
import { CompleteForecast } from "../views/weather/complete";
import { renderApp } from "./_app";

export interface RenderWeatherOptions {
    readonly deps: DepsObject;
    readonly searchDisabled?: boolean;
    readonly link: LinkDestinationTo<"weather">;
    readonly weather: Weather;
    readonly airConditions: CurrentAirConditions;
}

export function renderWeather({ deps, link, searchDisabled, weather, airConditions }: RenderWeatherOptions): string {
    const className = elementStyleFor(weather.currentWeather?.conditionCode, weather.currentWeather?.daylight);
    const searchQuery = link.query;
    return renderApp({ className, deps, searchQuery, searchDisabled }, (
        <>
            <CompleteForecast weather={weather} air={airConditions} />
        </>
    ));
}
