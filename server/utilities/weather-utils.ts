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

import { differenceInSeconds } from "date-fns";
import { Attribution, Weather, WeatherAttribution, WeatherToken } from "fruit-company";
import { find } from "geo-tz";
import { fulfill } from "serene-front";
import { LocationCoordinates } from "serene-front/models";

const attributionCache = new Map<string, Attribution>();
export async function attributionFor(token: WeatherToken, language: string): Promise<Attribution> {
    const existingAttribution = attributionCache.get(language);
    if (existingAttribution !== undefined) {
        return existingAttribution
    }
    const getAttribution = new WeatherAttribution({ language });
    const newAttribution = await fulfill({ authority: token, request: getAttribution });
    attributionCache.set(language, newAttribution);
    return newAttribution;
}

export function timezoneFor({ latitude, longitude }: LocationCoordinates): string {
    const timezones = find(latitude, longitude);
    if (timezones.length === 0) {
        throw new Error(`No time zone found for { ${latitude}, ${longitude} }`);
    }
    return timezones[0];
}

export function cacheControlFor(weather: Weather): string {
    const metadata = weather.currentWeather?.metadata;
    if (metadata === undefined) {
        return "no-cache";
    }
    const { readTime, expireTime } = metadata;
    const maxAge = differenceInSeconds(expireTime, readTime);
    return `public, max-age=${maxAge}`;
}