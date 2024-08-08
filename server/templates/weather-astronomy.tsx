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

import { Attribution, Weather } from "fruit-company/weather";
import { LinkDestinationTo } from "../routes/_links";
import { elementStyleFor } from "../styling/element-style";
import { DepsObject } from "../views/_deps";
import { WeatherSource } from "../views/components/weather-source";
import { ModeSelector } from "../views/mode-selector";
import { MiniCurrentForecast } from "../views/weather-astronomy/mini-current-forecast";
import { MoonForecast } from "../views/weather-astronomy/moon-forecast";
import { SolarForecast } from "../views/weather-astronomy/solar-forecast";
import { renderApp } from "./_app";

export interface RenderWeatherAstronomyOptions {
    readonly deps: DepsObject;
    readonly searchDisabled?: boolean;
    readonly link: LinkDestinationTo<"weather">;
    readonly weather: Weather;
    readonly attribution: Attribution;
}

export function renderWeatherAstronomy({ deps, link, searchDisabled, weather, attribution }: RenderWeatherAstronomyOptions): string {
    const className = elementStyleFor(weather.currentWeather?.conditionCode, weather.currentWeather?.daylight);
    const searchQuery = link.query;
    return renderApp({ className, deps, searchQuery, searchDisabled }, (
        <>
            <ModeSelector link={link} mode="astronomy" />
            <MiniCurrentForecast now={weather.currentWeather} />
            <MoonForecast today={weather.forecastDaily?.days?.[0]} />
            <SolarForecast today={weather.forecastDaily?.days?.[0]} />
            <WeatherSource weather={weather} attribution={attribution} />
        </>
    ));
}
