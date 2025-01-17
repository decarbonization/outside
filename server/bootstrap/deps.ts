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

import { MapsToken } from "fruit-company/maps";
import { WeatherToken } from "fruit-company/weather";
import { GoogleMapsApiKey } from "good-breathing";
import { MailtrapClient } from "mailtrap";
import { DBAccountStore } from "../accounts/db-store";
import { UserSystem } from "../accounts/system";
import { env, envStrings } from "../utilities/env";

export interface DepsObject {
    readonly gMapsApiKey: GoogleMapsApiKey;
    readonly mailer: MailtrapClient;
    readonly mapsToken: MapsToken;
    readonly userSystem: UserSystem;
    readonly weatherToken: WeatherToken;
}

export default function prepareDeps(): DepsObject {
    return {
        gMapsApiKey: new GoogleMapsApiKey(
            env("GOOGLE_MAPS_API_KEY"),
        ),
        mailer: new MailtrapClient({
            token: env("MAILTRAP_API_KEY"),
        }),
        mapsToken: new MapsToken(
            env("APPLE_MAPS_APP_ID"),
            env("APPLE_TEAM_ID"),
            env("APPLE_MAPS_KEY_ID"),
            env("APPLE_MAPS_KEY"),
        ),
        userSystem: new UserSystem({
            store: new DBAccountStore(),
            salts: envStrings("SALTS"),
        }),
        weatherToken: new WeatherToken(
            env("APPLE_WEATHER_APP_ID"),
            env("APPLE_TEAM_ID"),
            env("APPLE_WEATHER_KEY_ID"),
            env("APPLE_WEATHER_KEY"),
        ),
    };
}
