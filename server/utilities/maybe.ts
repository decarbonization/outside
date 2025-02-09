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

/**
 * Check whether a value is a string at runtime.
 * 
 * @param value The value to check.
 * @returns The value cast to `string` if it passes a runtime check; `undefined` otherwise.
 */
export function proveString(value: unknown): string | undefined {
    if (typeof value === 'string') {
        return value;
    } else {
        return undefined;
    }
}

/**
 * Transform a value unless it is `undefined`.
 * 
 * @param value A possibly undefined value.
 * @param transform A function which will take a value and transform it into another value.
 * @returns A transformed value or `undefined` if there was no value.
 */
export function mapIfNotUndefined<T, U>(value: T | undefined, transform: (value: T) => U): U | undefined {
    if (value === undefined) {
        return undefined;
    }
    return transform(value);
}
