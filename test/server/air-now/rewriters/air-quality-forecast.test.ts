import { describe, expect, it } from '@jest/globals';
import { airQualityForecastFrom } from '../../../../server/air-now/rewriters/air-quality-forecast';
import { AqiCategory, AqiReadingType } from '../../../../server/air-now/models/core';

describe("air-now#rewriters#air-quality-forecast module", () => {
    describe("#airQualityForecastFrom", () => {
        const raw = JSON.parse(`
            [
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-27",
                    "ReportingArea": "Lynn",
                    "StateCode": "MA",
                    "Latitude": 42.4744,
                    "Longitude": -70.9725,
                    "ParameterName": "O3",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-27",
                    "ReportingArea": "Lynn",
                    "StateCode": "MA",
                    "Latitude": 42.4744,
                    "Longitude": -70.9725,
                    "ParameterName": "PM2.5",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-28",
                    "ReportingArea": "Lynn",
                    "StateCode": "MA",
                    "Latitude": 42.4744,
                    "Longitude": -70.9725,
                    "ParameterName": "O3",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-28",
                    "ReportingArea": "Lynn",
                    "StateCode": "MA",
                    "Latitude": 42.4744,
                    "Longitude": -70.9725,
                    "ParameterName": "PM2.5",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-29",
                    "ReportingArea": "Lynn",
                    "StateCode": "MA",
                    "Latitude": 42.4744,
                    "Longitude": -70.9725,
                    "ParameterName": "O3",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-29",
                    "ReportingArea": "Lynn",
                    "StateCode": "MA",
                    "Latitude": 42.4744,
                    "Longitude": -70.9725,
                    "ParameterName": "PM2.5",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                }
            ]
        `);
        const subject = airQualityForecastFrom(raw);

        it("should translate dates", () => {
            expect(subject.days.map(day => day.forecastStart)).toStrictEqual([
                new Date("2024-06-27T00:00:00.000Z"),
                new Date("2024-06-28T00:00:00.000Z"),
                new Date("2024-06-29T00:00:00.000Z"),
            ]);
            expect(subject.days.map(day => day.forecastEnd)).toStrictEqual([
                new Date("2024-06-28T00:00:00.000Z"),
                new Date("2024-06-29T00:00:00.000Z"),
                new Date("2024-06-30T00:00:00.000Z"),
            ]);
        });

        it("should translate location", () => {
            expect(subject.days.map(day => day.location)).toStrictEqual([
                { latitude: 42.4744, longitude: -70.9725 },
                { latitude: 42.4744, longitude: -70.9725 },
                { latitude: 42.4744, longitude: -70.9725 },
            ]);
        });

        it("should aggregate readings", () => {
            expect(subject.days.map(day => day.readings)).toStrictEqual([
                [
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.ozone, },
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.fineParticles, },
                ],
                [
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.ozone, },
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.fineParticles, },
                ],
                [
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.ozone, },
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.fineParticles, },
                ],
            ]);
        });
    });
});
