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
import { LocationCoordinates } from 'serene-front/data';
import { linkTo } from '../../../server/routes/_links';

describe("routes#_links module", () => {
    describe("#linkTo", () => {
        it("should include index query when specified", () => {
            expect(linkTo({ where: "index" })).toStrictEqual('/');
            expect(linkTo({ where: "index", query: "New York" })).toStrictEqual('/?q=New%20York');
        });

        it("should include login verify return to when specified", () => {
            expect(linkTo({where: "loginVerify", otp: "123" })).toStrictEqual('/login/verify/123');
            expect(linkTo({where: "loginVerify", otp: "123", returnTo: "/" })).toStrictEqual('/login/verify/123?returnto=%2F');
        });

        it("should include search query when specified", () => {
            expect(linkTo({ where: "searchByQuery" })).toStrictEqual('/search');
            expect(linkTo({ where: "searchByQuery", query: "New York" })).toStrictEqual('/search?q=New%20York');
        });

        it("should not reduce precision of search geo coordinates", () => {
            expect(linkTo({ where: "searchByCoordinates", location: new LocationCoordinates(40.7129822, -74.007205) })).toStrictEqual('/search/40.7129822/-74.007205');
        });

        it("should reduce precision of weather geo coordinates", () => {
            expect(linkTo({ where: "weather", tab: "forecast", countryCode: "US", location: new LocationCoordinates(40.7129822, -74.007205), query: "New York" })).toStrictEqual("/weather/US/40.712/-74.008/New%20York");
        });

        it("should include weather tab", () => {
            expect(linkTo({ where: "weather", tab: "air", countryCode: "US", location: new LocationCoordinates(40.7129822, -74.007205), query: "New York" })).toStrictEqual("/weather/US/40.712/-74.008/New%20York/air");
        });
    });
});
