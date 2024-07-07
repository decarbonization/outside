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

import { LocationCoordinates } from "fruit-company";
import { AqiReading } from "./core";

export interface AirQualityForecastDay {
    readonly forecastStart: Date;
    readonly forecastEnd: Date;
    readonly location: LocationCoordinates;
    readonly reportingArea: string;
    readonly stateCode: string;
    readonly readings: readonly AqiReading[];
    readonly actionDay: boolean;
    readonly discussion: string;
}

export interface AirQualityForecast {
    readonly days: readonly AirQualityForecastDay[];
}
