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
 * Split an array into a collection of chunks.
 * 
 * @param array The array to split into chunks.
 * @param every The maximum number of elements to include in each chunk.
 * @throws A `RangeError` if `every <= 0 || every > array.length`.
 * @returns An array of arrays.
 */
export function segmentBy<T>(array: readonly T[], every: number): T[][] {
    if (every <= 0 || every > array.length) {
        throw new RangeError(`<${every}> is not a valid array chunk size`);
    }
    const segments: T[][] = [];
    for (let start = 0, length = array.length; start < length; start += every) {
        segments.push(array.slice(start, start + every));
    }
    return segments;
}
