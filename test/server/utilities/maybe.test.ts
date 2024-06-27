import { describe, expect, it } from "@jest/globals";
import { mapIfNotUndefined } from "../../../server/utilities/maybe";

describe("maybe module", () => {
    describe("#mapIfNotUndefined", () => {
        it("should propagate undefined values", () => {
            const nothing = undefined as string | undefined;
            expect(mapIfNotUndefined(nothing, value => Number(value))).toBeUndefined();
        });

        it("should transform defined values", () => {
            expect(mapIfNotUndefined("42", value => Number(value))).toStrictEqual(42);
        });
    });
});
