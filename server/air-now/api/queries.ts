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

import convert from "convert";
import { format } from "date-fns";
import { FruitRequest, LocationCoordinates } from "fruit-company";
import { AirQualityForecast } from "../models/air-quality-forecast";
import { CurrentAirQuality } from "../models/current-air-quality";
import { currentAirQualityFrom } from "../rewriters/current-air-quality";
import { AirNowToken } from "./air-now-token";
import { airQualityForecastFrom } from "../rewriters/air-quality-forecast";

const baseUrl = "https://www.airnowapi.org/aq";

export interface CurrentAirQualityQueryOptions {
    readonly location: LocationCoordinates;
    readonly distance?: number;
}

export class CurrentAirQualityQuery implements FruitRequest<AirNowToken, CurrentAirQuality> {
    constructor(private readonly options: CurrentAirQualityQueryOptions) {
    }

    prepare(token: AirNowToken): Request {
        const url = new URL(`${baseUrl}/observation/latLong/current`);
        url.searchParams.set("format", "application/json");
        url.searchParams.set("latitude", String(this.options.location.latitude));
        url.searchParams.set("longitude", String(this.options.location.longitude));
        if (this.options.distance !== undefined) {
            url.searchParams.set("distance", String(convert(this.options.distance, "meters").to("mile")));
        }
        token._decorate(url);
        return new Request(url);
    }

    async parse(fetchResponse: Response): Promise<CurrentAirQuality> {
        const raw = await fetchResponse.json();
        return currentAirQualityFrom(raw);
    }
}

export interface AirQualityForecastQueryOptions {
    readonly location: LocationCoordinates;
    readonly distance?: number;
    readonly date?: Date;
}

export class AirQualityForecastQuery implements FruitRequest<AirNowToken, AirQualityForecast> {
    constructor(private readonly options: AirQualityForecastQueryOptions) {
    }

    prepare(token: AirNowToken): Request {
        const url = new URL(`${baseUrl}/forecast/latLong`);
        url.searchParams.set("format", "application/json");
        url.searchParams.set("latitude", String(this.options.location.latitude));
        url.searchParams.set("longitude", String(this.options.location.longitude));
        if (this.options.distance !== undefined) {
            url.searchParams.set("distance", String(convert(this.options.distance, "meters").to("mile")));
        }
        if (this.options.date !== undefined) {
            url.searchParams.set("date", format(this.options.date, "yyyy-mm-dd"));
        }
        token._decorate(url);
        return new Request(url);
    }
    async parse(fetchResponse: Response): Promise<AirQualityForecast> {
        const raw = await fetchResponse.json();
        return airQualityForecastFrom(raw);
    }
}
