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
import { WeatherCondition } from 'fruit-company/weather';
import { Theme, themeIcon } from '../../../server/styling/themes';

describe("themes module", () => {
    const emptyTheme: Theme = {
        name: 'test',
        links: [],
        icons: {},
    };

    describe("#themeIcon", () => {
        it("should return simple icons unmodified", () => {
            const subject = {
                ...emptyTheme,
                icons: {
                    [WeatherCondition.clear]: "clear",
                },
            };
            expect(themeIcon(subject, { name: WeatherCondition.clear })).toStrictEqual("clear");
        });

        it("should include base on simple icons", () => {
            const subject = {
                ...emptyTheme,
                icons: {
                    "base": "icons",
                    [WeatherCondition.clear]: "clear",
                },
            };
            expect(themeIcon(subject, { name: WeatherCondition.clear })).toStrictEqual("icons clear");
        });

        it("should default to day icons", () => {
            const subject = {
                ...emptyTheme,
                icons: {
                    [WeatherCondition.clear]: { day: "sunny", night: "clear" },
                },
            };
            expect(themeIcon(subject, { name: WeatherCondition.clear })).toStrictEqual("sunny");
        });

        it("should return day icons", () => {
            const subject = {
                ...emptyTheme,
                icons: {
                    [WeatherCondition.clear]: { day: "sunny", night: "clear" },
                },
            };
            expect(themeIcon(subject, { name: WeatherCondition.clear, daylight: true })).toStrictEqual("sunny");
        });

        it("should return night icons", () => {
            const subject = {
                ...emptyTheme,
                icons: {
                    [WeatherCondition.clear]: { day: "sunny", night: "clear" },
                },
            };
            expect(themeIcon(subject, { name: WeatherCondition.clear, daylight: false })).toStrictEqual("clear");
        });

        it("should include base on day icons", () => {
            const subject = {
                ...emptyTheme,
                icons: {
                    "base": "icons",
                    [WeatherCondition.clear]: { day: "sunny", night: "clear" },
                },
            };
            expect(themeIcon(subject, { name: WeatherCondition.clear, daylight: true })).toStrictEqual("icons sunny");
        });

        it("should include base on night icons", () => {
            const subject = {
                ...emptyTheme,
                icons: {
                    "base": "icons",
                    [WeatherCondition.clear]: { day: "sunny", night: "clear" },
                },
            };
            expect(themeIcon(subject, { name: WeatherCondition.clear, daylight: false })).toStrictEqual("icons clear");
        });
    });
});