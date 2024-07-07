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

import { addDays } from "date-fns";
import { AirQualityForecast, AirQualityForecastDay } from "../models/air-quality-forecast";
import { RawForecast, RawForecastResponse } from "../models/raw";

export function airQualityForecastFrom(raw: RawForecastResponse): AirQualityForecast {
    if (raw.length === 0) {
        throw new RangeError("Empty current observation response");
    }

    const rawByDate = segmentByDate(raw);
    const days: AirQualityForecastDay[] = [];
    for (const [forecastStart, raw] of rawByDate) {
        const forecastEnd = addDays(forecastStart, 1);
        const reference = raw[0];
        const location = {
            latitude: reference.Latitude,
            longitude: reference.Longitude,
        };
        const reportingArea = reference.ReportingArea;
        const stateCode = reference.StateCode;
        const readings = raw.map(o => ({
            type: o.ParameterName,
            category: o.Category.Number,
            aqi: o.AQI,
        }));
        const actionDay = raw.some(o => o.ActionDay);
        const discussion = Array.from(
            raw.reduce(
                (acc, o) => acc.add(o.Discussion), 
                new Set<string>()
            )
        ).join("\n");
        days.push({
            forecastStart,
            forecastEnd,
            location,
            reportingArea,
            stateCode,
            readings,
            actionDay,
            discussion,
        });
    }
    return {
        days,
    };
}

function* segmentByDate(raw: RawForecastResponse): IterableIterator<[Date, RawForecast[]]> {
    const byRawDate = new Map<string, RawForecast[]>();
    for (const forecast of raw) {
        const rawDate = forecast.DateForecast;
        let segment = byRawDate.get(rawDate);
        if (segment === undefined) {
            segment = [];
            byRawDate.set(rawDate, segment);
        }
        segment.push(forecast);
    }
    for (const [rawDate, segment] of byRawDate.entries()) {
        yield [new Date(rawDate), segment];
    }
}
