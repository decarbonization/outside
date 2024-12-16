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

import { mapIfNotUndefined } from "./maybe";

/**
 * Environment keys whose values are strings.
 */
export type EnvStringKey =
    | 'APPLE_TEAM_ID'
    | 'APPLE_MAPS_APP_ID'
    | 'APPLE_MAPS_KEY_ID'
    | 'APPLE_MAPS_KEY'
    | 'APPLE_WEATHER_APP_ID'
    | 'APPLE_WEATHER_KEY_ID'
    | 'APPLE_WEATHER_KEY'
    | 'GOOGLE_MAPS_API_KEY'
    | 'MAILTRAP_API_KEY'
    | 'MAILTRAP_SENDER'
    | 'DATABASE_URL'
    | 'HOST';

/**
 * Access an environment variable, throwing an error if no value is found.
 * 
 * @param key A key which should be present in the environment.
 * @param defaultValue An optional default value for the variable.
 * @returns The value for `key`.
 */
export function env(key: EnvStringKey, defaultValue?: string): string {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        throw new Error(`$${key} not present in environment`);
    }
    return value;
}

/**
 * Environment keys whose values are integers.
 */
export type EnvIntKey =
    | 'PORT'
    | 'DAILY_FORECAST_LIMIT'
    | 'HOURLY_FORECAST_LIMIT'
    | 'DAILY_POLLEN_FORECAST_LIMIT';

/**
 * Access an integer environment variable, throwing an error if no value is found.
 * 
 * @param key A key which should be present in the environment.
 * @param defaultValue An optional default value for the variable.
 * @returns The integer value for `key`.
 */
export function envInt(key: EnvIntKey, defaultValue?: number): number {
    const value = mapIfNotUndefined(process.env[key], value => parseInt(value, 10)) ?? defaultValue;
    if (value === undefined) {
        throw new Error(`$${key} not present in environment`);
    }
    return value;
}

/**
 * Environment keys whose values are flags.
 */
export type EnvFlagKey =
    | 'DISABLE_SIGN_UP';

/**
 * Access a boolean environment variable, throwing an error if no value is found.
 * 
 * @param key A key which should be present in the environment.
 * @param defaultValue An optional default value for the variable.
 * @returns The boolean value for `key`.
 */
export function envFlag(key: EnvFlagKey, defaultValue?: boolean): boolean {
    const value = mapIfNotUndefined(process.env[key], value => Boolean(value)) ?? defaultValue;
    if (value === undefined) {
        throw new Error(`$${key} not present in environment`);
    }
    return value;
}

/**
 * Environment keys whose values are arrays of strings.
*/
export type EnvStringsKey =
    | 'SESSION_SECRETS'
    | 'SALTS'
    | 'ANALYTICS_SCRIPTS';

/**
 * Access a string array environment variable, throwing an error if no value is found.
 * 
 * @param key A key which should be present in the environment.
 * @param defaultValue An optional default value for the variable.
 * @param separator The string to separate components in the array with.
 * @returns The boolean value for `key`.
 */
export function envStrings(key: EnvStringsKey, defaultValue?: string[], separator: string = ","): string[] {
    const value = mapIfNotUndefined(process.env[key], value => value.split(separator)) ?? defaultValue;
    if (value === undefined) {
        throw new Error(`$${key} not present in environment`);
    }
    return value;
}
