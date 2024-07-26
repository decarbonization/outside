import { describe, expect, it } from '@jest/globals';
import { linkTo } from '../../../server/routes/_links';

describe("routes#_links module", () => {
    describe("#linkTo", () => {
        it("should include index query when specified", () => {
            expect(linkTo({ where: "index" })).toStrictEqual('/');
            expect(linkTo({ where: "index", query: "New York" })).toStrictEqual('/?q=New%20York');
        });
        
        it("should include search query when specified", () => {
            expect(linkTo({ where: "searchByQuery" })).toStrictEqual('/search');
            expect(linkTo({ where: "searchByQuery", query: "New York" })).toStrictEqual('/search?q=New%20York');
        });

        it("should not reduce precision of search geo coordinates", () => {
            expect(linkTo({ where: "searchByCoordinates", location: { latitude: 40.7129822, longitude: -74.007205 } })).toStrictEqual('/search/40.7129822/-74.007205');
        });

        it("should reduce precision of weather geo coordinates", () => {
            expect(linkTo({ where: "weather", countryCode: "US", location: { latitude: 40.7129822, longitude: -74.007205 }, query: "New York" })).toStrictEqual("/weather/US/40.712/-74.008/New%20York");
        });

        it("should include weather subcategory when specified", () => {
            expect(linkTo({ where: "weather", sub: "air", countryCode: "US", location: { latitude: 40.7129822, longitude: -74.007205 }, query: "New York" })).toStrictEqual("/weather/US/40.712/-74.008/New%20York/air");
        });

        it("should include weather ref when specified", () => {
            expect(linkTo({ where: "weather", countryCode: "US", location: { latitude: 40.7129822, longitude: -74.007205 }, query: "New York", ref: "loc" })).toStrictEqual("/weather/US/40.712/-74.008/New%20York?ref=loc");
        });
    });
});
