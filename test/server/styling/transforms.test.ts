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

import { describe, expect, it } from '@jest/globals';
import { camelCaseToKebabCase, camelCaseToSnakeCase, percentage } from '../../../server/styling/transforms';

describe("transforms module", () => {
    describe("#camelCaseToKebabCase", () => {
        it("should leave a single lowercase word untransformed", () => {
            expect(camelCaseToKebabCase("hello")).toStrictEqual("hello");
        });

        it("should lowercase words and join them with a hyphen", () => {
            expect(camelCaseToKebabCase("HelloWorld")).toStrictEqual("hello-world");
        });

        it("should lowercase abbreviations and join them with a hyphen", () => {
            expect(camelCaseToKebabCase("toISOString")).toStrictEqual("to-iso-string");
        });
    });

    describe("#camelCaseToKebabCase", () => {
        it("should leave a single lowercase word untransformed", () => {
            expect(camelCaseToSnakeCase("hello")).toStrictEqual("hello");
        });

        it("should lowercase words and join them with an underscore", () => {
            expect(camelCaseToSnakeCase("HelloWorld")).toStrictEqual("hello_world");
        });

        it("should lowercase abbreviations and join them with an underscore", () => {
            expect(camelCaseToSnakeCase("toISOString")).toStrictEqual("to_iso_string");
        });
    });

    describe("#percentage", () => {
        it("should produce a CSS percentage value", () => {
            expect(percentage(0.0)).toStrictEqual("0%");
            expect(percentage(0.5)).toStrictEqual("50%");
            expect(percentage(1.0)).toStrictEqual("100%");
        });

        it("should include fraction digits when specified", () => {
            expect(percentage(0.555, 1)).toStrictEqual("55.5%");
        });
    });
});
