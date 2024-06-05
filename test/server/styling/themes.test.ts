import { describe, expect, it } from '@jest/globals';
import { Theme, themeIcon } from '../../../server/styling/themes';
import { WeatherCondition } from '../../../fruit-company/weather/models/base';

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