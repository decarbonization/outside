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
 * Access an environment variable, throwing an error if no value is found.
 * 
 * @param key A key which should be present in the environment.
 * @param defaultValue An optional default value for the variable.
 * @returns The value for `key`.
 */
export function env(key: string, defaultValue?: string): string {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        throw new Error(`$${key} not present in environment`);
    }
    return value;
}

/**
 * Access an integer environment variable, throwing an error if no value is found.
 * 
 * @param key A key which should be present in the environment.
 * @param defaultValue An optional default value for the variable.
 * @returns The integer value for `key`.
 */
export function envInt(key: string, defaultValue?: number): number {
    const value = mapIfNotUndefined(process.env[key], value => parseInt(value, 10)) ?? defaultValue;
    if (value === undefined) {
        throw new Error(`$${key} not present in environment`);
    }
    return value;
}
