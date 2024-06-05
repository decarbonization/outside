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

import { Weather } from "../../fruit-company/weather/models/weather";
import { CurrentForecast } from "./current-forecast";
import { DailyForecast } from "./daily-forecast";
import { HourlyForecast } from "./hourly-forecast";

export interface WeatherDetailsProps {
    readonly weather?: Weather;
}

export function WeatherDetails({weather}: WeatherDetailsProps) {
    return (
        <>
            <CurrentForecast now={weather?.currentWeather} today={weather?.forecastDaily?.days?.[0]} />
            <HourlyForecast forecast={weather?.forecastHourly} />
            <DailyForecast forecast={weather?.forecastDaily} />
        </>
    );
}