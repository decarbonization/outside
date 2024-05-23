import { describe, expect, it } from '@jest/globals';
import { camelCaseToKebabCase, camelCaseToSnakeCase, camelCaseToVariable } from '../../app/styling/transforms';

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

    describe("#camelCaseToKebabCase", () => {
        it("should uppercase a single lowercase word", () => {
            expect(camelCaseToVariable("hello")).toStrictEqual("$HELLO$");
        });

        it("should uppercase words and join them with an underscore", () => {
            expect(camelCaseToVariable("HelloWorld")).toStrictEqual("$HELLO_WORLD$");
        });

        it("should reject empty strings", () => {
            expect(() => camelCaseToVariable("")).toThrow();
        });
    });
});
