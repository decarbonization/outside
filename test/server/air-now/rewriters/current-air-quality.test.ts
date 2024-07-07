import { describe, expect, it } from '@jest/globals';
import { currentAirQualityFrom } from '../../../../server/air-now/rewriters/current-air-quality';
import { RawCurrentObservationResponse } from '../../../../server/air-now/models/raw';
import { AqiCategory, AqiReadingType } from '../../../../server/air-now/models/core';

describe("air-now#rewriters#current-air-quality module", () => {
    describe("#currentAirQualityFrom", () => {
        const raw: RawCurrentObservationResponse = JSON.parse(`
            [
                {
                    "DateObserved": "2024-06-27",
                    "HourObserved": 21,
                    "LocalTimeZone": "EST",
                    "ReportingArea": "Lynn",
                    "StateCode": "MA",
                    "Latitude": 42.4744,
                    "Longitude": -70.9725,
                    "ParameterName": "O3",
                    "AQI": 34,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    }
                },
                {
                    "DateObserved": "2024-06-27",
                    "HourObserved": 21,
                    "LocalTimeZone": "EST",
                    "ReportingArea": "Lynn",
                    "StateCode": "MA",
                    "Latitude": 42.4744,
                    "Longitude": -70.9725,
                    "ParameterName": "PM2.5",
                    "AQI": 23,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    }
                }
            ]
        `);
        const subject = currentAirQualityFrom(raw);

        it("should translate date", () => {
            expect(subject.asOf).toStrictEqual(new Date("2024-06-27T01:00:00.000Z"));
        });

        it("should translate location", () => {
            expect(subject.location).toStrictEqual({ latitude: 42.4744, longitude: -70.9725 });
        });

        it("should average AQI", () => {
            expect(subject.aqi).toStrictEqual(29);
        });

        it("should average category", () => {
            expect(subject.category).toStrictEqual(AqiCategory.good);
        });

        it("should aggregate readings", () => {
            expect(subject.readings).toStrictEqual([
                {
                    type: AqiReadingType.ozone,
                    category: AqiCategory.good,
                    aqi: 34,
                },
                {
                    type: AqiReadingType.fineParticles,
                    category: AqiCategory.good,
                    aqi: 23,
                },
            ]);
        });
    });
});
