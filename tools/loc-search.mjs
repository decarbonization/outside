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

import dotenv from 'dotenv';
import { GeocodeAddress, MapsToken } from 'fruit-company';
import { fulfill } from "serene-front";

dotenv.config();

const mapsToken = new MapsToken(
    process.env["APPLE_MAPS_APP_ID"],
    process.env["APPLE_TEAM_ID"],
    process.env["APPLE_MAPS_KEY_ID"],
    process.env["APPLE_MAPS_KEY"],
);
await mapsToken.refresh({});

const query = "brooklyn";
const language = "en-US";
const geocodeAddress = new GeocodeAddress({ query, language });
const places = await fulfill({ authority: mapsToken, request: geocodeAddress });
console.log(JSON.stringify(places));
