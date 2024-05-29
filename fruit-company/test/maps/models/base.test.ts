import { describe, expect, it } from "@jest/globals";
import { LocationCoordinates, truncateLocationCoordinates, urlLocationCoordinates } from "../../../maps/models/base";

describe("maps#models module", () => {
    describe("#truncateLocationCoordinates", () => {
        it("should reduce the accuracy of geographic coordinates", () => {
            const subject: LocationCoordinates = {
                latitude: 35.689506,
                longitude: 139.6917,
            };
            expect(truncateLocationCoordinates(subject, 1)).toEqual({
                latitude: 35.6,
                longitude: 139.6,
            });
            expect(truncateLocationCoordinates(subject, 2)).toEqual({
                latitude: 35.68,
                longitude: 139.69,
            });
            expect(truncateLocationCoordinates(subject, 4)).toEqual({
                latitude: 35.6895,
                longitude: 139.6917,
            });
        });
    });

    describe("#urlLocationCoordinates", () => {
        it("should format coordinates like required by fruit company APIs", () => {
            const subject: LocationCoordinates = {
                latitude: 35.689506,
                longitude: 139.6917,
            };
            expect(urlLocationCoordinates(subject)).toStrictEqual("35.689506,139.6917");
        });
    });
});
