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

import { CurrentAirQuality } from "../models/current-air-quality";
import { RawCurrentObservationResponse } from "../models/raw";

export function currentAirQualityFrom(raw: RawCurrentObservationResponse): CurrentAirQuality {
    if (raw.length === 0) {
        throw new RangeError("Empty current observation response");
    }

    const reference = raw[0];
    const asOf = new Date(reference.DateObserved);
    asOf.setHours(reference.HourObserved);
    const timeZone = reference.LocalTimeZone;
    const location = {
        latitude: reference.Latitude,
        longitude: reference.Longitude,
    };
    const reportingArea = reference.ReportingArea;
    const stateCode = reference.StateCode;
    const aqi = Math.round(raw.reduce((acc, o) => acc + o.AQI, 0) / raw.length);
    const category = Math.round(raw.reduce((acc, o) => acc + o.Category.Number, 0) / raw.length);
    const readings = raw.map(o => ({
        type: o.ParameterName,
        category: o.Category.Number,
        aqi: o.AQI,
    }));
    return {
        asOf,
        timeZone,
        location,
        reportingArea,
        stateCode,
        aqi,
        category,
        readings,
    };
}
