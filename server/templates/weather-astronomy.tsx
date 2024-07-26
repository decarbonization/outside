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

import { Attribution, Weather } from "fruit-company";
import { LinkDestinationTo } from "../routes/_links";
import { elementStyleFor } from "../styling/element-style";
import { DepsObject } from "../views/_deps";
import { ModeSelector } from "../views/mode-selector";
import { PlaceSearch } from "../views/place-search";
import { WeatherSource } from "../views/weather/weather-source";
import { renderApp } from "./_app";
import { MiniCurrentForecast } from "../views/weather-astronomy/mini-current-forecast";
import { MoonForecast } from "../views/weather-astronomy/moon-forecast";
import { SolarForecast } from "../views/weather-astronomy/solar-forecast";

export interface RenderWeatherAstronomyOptions {
    readonly deps: DepsObject;
    readonly disableSearch?: boolean;
    readonly link: LinkDestinationTo<"weather">;
    readonly weather: Weather;
    readonly attribution: Attribution;
}

export function renderWeatherAstronomy({ deps, link, disableSearch, weather, attribution }: RenderWeatherAstronomyOptions): string {
    const className = elementStyleFor(weather.currentWeather?.conditionCode, weather.currentWeather?.daylight);
    return renderApp({ className, deps }, (
        <>
            <PlaceSearch query={link.query} disabled={disableSearch} />
            <ModeSelector link={link} mode="astronomy" />
            <MiniCurrentForecast now={weather.currentWeather} />
            <MoonForecast today={weather.forecastDaily?.days?.[0]} />
            <SolarForecast today={weather.forecastDaily?.days?.[0]} />
            <WeatherSource weather={weather} attribution={attribution} />
        </>
    ));
}
