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

import { addDays, addHours } from "date-fns";
import dotenv from 'dotenv';
import { WeatherQuery, WeatherToken, allWeatherDataSets } from 'fruit-company';
import { fulfill } from "serene-front";

dotenv.config();

const weatherToken = new WeatherToken(
    process.env["APPLE_WEATHER_APP_ID"],
    process.env["APPLE_TEAM_ID"],
    process.env["APPLE_WEATHER_KEY_ID"],
    process.env["APPLE_WEATHER_KEY"],
);
await weatherToken.refresh();

const language = "en-US";
const location = {
    latitude: 42.478,
    longitude: -70.925,
};
const timezone = "America/New_York";
const countryCode = "US";
const currentAsOf = new Date();
const weatherQuery = new WeatherQuery({
    language,
    location,
    timezone,
    countryCode,
    currentAsOf,
    dailyEnd: addDays(currentAsOf, 7),
    dailyStart: currentAsOf,
    dataSets: allWeatherDataSets,
    hourlyEnd: addHours(currentAsOf, 24),
    hourlyStart: currentAsOf,
});

const weather = await fulfill({ token: weatherToken, request: weatherQuery });
console.log(JSON.stringify(weather));
