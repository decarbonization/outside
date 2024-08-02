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

import { describe, expect, it } from "@jest/globals";
import { segmentBy } from "../../../server/utilities/array-utils";

describe("array-utils module", () => {
    describe("#segmentBy", () => {
        it("should reject invalid inputs", () => {
            expect(() => segmentBy([1, 2, 3], -1)).toThrow();
            expect(() => segmentBy([1, 2, 3], 0)).toThrow();
            expect(() => segmentBy([1, 2, 3], 4)).toThrow();
        });

        it("should return segments evenly divided", () => {
            expect(segmentBy([1, 2, 3, 4, 5, 6, 7, 8], 2)).toStrictEqual([
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8],
            ]);
        });

        it("should capture remainder elements when applicable", () => {
            expect(segmentBy([1, 2, 3, 4, 5, 6, 7, 8, 9], 2)).toStrictEqual([
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8],
                [9],
            ]);
        });
    });
});