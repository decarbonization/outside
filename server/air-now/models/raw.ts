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

import { AqiCategory, AqiReadingType } from "./core";

export interface RawCategoryObject {
    readonly Number: AqiCategory;
    readonly Name: string;
}

export interface RawCurrentObservation {
    readonly DateObserved: string;
    readonly HourObserved: number;
    readonly LocalTimeZone: string;
    readonly ReportingArea: string;
    readonly StateCode: string;
    readonly Latitude: number;
    readonly Longitude: number;
    readonly ParameterName: AqiReadingType;
    readonly AQI: number;
    readonly Category: RawCategoryObject;
}

export type RawCurrentObservationResponse = readonly RawCurrentObservation[];

export interface RawForecast {
    readonly DateIssue: string;
    readonly DateForecast: string;
    readonly ReportingArea: string;
    readonly StateCode: string;
    readonly Latitude: number;
    readonly Longitude: number;
    readonly ParameterName: AqiReadingType;
    readonly AQI: number;
    readonly Category: RawCategoryObject;
    readonly ActionDay: boolean;
    readonly Discussion: string;
}

export type RawForecastResponse = readonly RawForecast[];

export const enum RawErrorCategory {
    WebServiceError = "WebServiceError",
}

export interface RawError {
    readonly Message: string;
}

export type RawErrorResponse = {
    readonly [key in RawErrorCategory]: readonly RawError[];
}
