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
import { mapIfNotUndefined, proveString } from "../../../server/utilities/maybe";

describe("maybe module", () => {
    describe("#proveString", () => {
        it("should propagate string values", () => {
            expect(proveString("hello")).toStrictEqual("hello");
        });

        it("should return undefined otherwise", () => {
            expect(proveString(undefined)).toBeUndefined();
            expect(proveString(null)).toBeUndefined();
            expect(proveString(1234)).toBeUndefined();
            expect(proveString(Symbol())).toBeUndefined();
            expect(proveString([])).toBeUndefined();
            expect(proveString({})).toBeUndefined();
        });
    });

    describe("#mapIfNotUndefined", () => {
        it("should propagate undefined values", () => {
            const nothing = undefined as string | undefined;
            expect(mapIfNotUndefined(nothing, value => Number(value))).toBeUndefined();
        });

        it("should transform defined values", () => {
            expect(mapIfNotUndefined("42", value => Number(value))).toStrictEqual(42);
        });
    });
});
