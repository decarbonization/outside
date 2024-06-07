import { describe, expect, it } from '@jest/globals';
import { WeatherRoutes } from '../../../server/routes/weather-routes';

describe("weather-routes module", () => {
    describe("#WeatherRoutes", () => {
        describe("#linkToGetWeather", () => {
            it("should reduce precision of geo coordinates", () => {
                expect(WeatherRoutes.linkToGetWeather("US", { latitude: 40.7129822, longitude: -74.007205 }, "New York")).toStrictEqual("/weather/US/40.712/-74.008/New%20York");
            });
        });
    });
});