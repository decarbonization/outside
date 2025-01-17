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

import { Weather } from "fruit-company/weather";
import { CurrentAirConditions } from "good-breathing/aqi";
import CurrentForecast from "./CurrentForecast";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";
import NextHourForecast from "./NextHourForecast";
import SolarForecast from "./SolarForecast";
import WeatherAlerts from "./WeatherAlerts";

export interface ForecastProps {
    readonly weather?: Weather;
    readonly air?: CurrentAirConditions;
}

export default function CompleteForecast({ weather, air }: ForecastProps) {
    return (
        <>
            <CurrentForecast now={weather?.currentWeather} today={weather?.forecastDaily?.days?.[0]} air={air} />
            <NextHourForecast forecast={weather?.forecastNextHour} />
            <WeatherAlerts collection={weather?.weatherAlerts} />
            <HourlyForecast forecast={weather?.forecastHourly} />
            <DailyForecast forecast={weather?.forecastDaily} />
            <SolarForecast today={weather?.forecastDaily?.days?.[0]} />
        </>
    );
}