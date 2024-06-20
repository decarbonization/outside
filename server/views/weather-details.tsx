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
import { CurrentForecast } from "./current-forecast";
import { DailyForecast } from "./daily-forecast";
import { HourlyForecast } from "./hourly-forecast";
import { WeatherSource } from "./weather-source";
import { WeatherAlerts } from "./weather-alerts";

export interface WeatherDetailsProps {
    readonly weather?: Weather;
    readonly attribution?: Attribution;
}

export function WeatherDetails({ weather, attribution }: WeatherDetailsProps) {
    return (
        <>
            <CurrentForecast now={weather?.currentWeather} today={weather?.forecastDaily?.days?.[0]} />
            <WeatherAlerts collection={weather?.weatherAlerts} />
            <HourlyForecast forecast={weather?.forecastHourly} />
            <DailyForecast forecast={weather?.forecastDaily} />
            <WeatherSource weather={weather} attribution={attribution} />
        </>
    );
}