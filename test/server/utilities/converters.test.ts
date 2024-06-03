import { describe, expect, it } from "@jest/globals";
import { coordinate } from "../../../server/utilities/converters";

describe("converters module", () => {
    describe("#coordinate", () => {
        it("should reject non-numeric strings", () => {
            expect(() => coordinate("x")).toThrow();
            expect(() => coordinate("twenty two")).toThrow();
        });

        it("should reject non-finite numbers", () => {
            expect(() => coordinate("NaN")).toThrow();
            expect(() => coordinate("inf")).toThrow();
        });

        it("should accept numbers", () => {
            expect(coordinate("-1")).toStrictEqual(-1);
            expect(coordinate("0")).toStrictEqual(0);
            expect(coordinate("1")).toStrictEqual(1);
        });
    });
});
