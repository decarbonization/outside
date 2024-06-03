import { describe, expect, it } from "@jest/globals";
import { SessionStorage } from "../../../server/utilities/storage";

describe("storage module", () => {
    describe("SessionStorage", () => {
        describe("#get", () => {
            it("should return undefined for a key not associated with any item", async () => {
                const subject = new SessionStorage();
                expect(await subject.getItem("notReal")).toBeUndefined();
            });
        });

        describe("#set", () => {
            it("should associate an item with a key", async () => {
                const subject = new SessionStorage();
                expect(await subject.getItem("meaningOfLife")).toBeUndefined();
                await subject.setItem("meaningOfLife", "42");
                expect(await subject.getItem("meaningOfLife")).toStrictEqual("42");
            });
        });

        describe("#remove", () => {
            it("should remove the item associated with a key", async () => {
                const subject = new SessionStorage();
                await subject.setItem("meaningOfLife", "42");
                expect(await subject.getItem("meaningOfLife")).toStrictEqual("42");
                await subject.removeItem("meaningOfLife");
                expect(await subject.getItem("meaningOfLife")).toBeUndefined();
            });
        });

        describe("#clear", () => {
            it("should remove all items associated with any keys", async () => {
                const subject = new SessionStorage();
                await subject.setItem("first", "1");
                await subject.setItem("second", "2");
                await subject.setItem("third", "3");
                expect(await subject.getItem("first")).toStrictEqual("1");
                expect(await subject.getItem("second")).toStrictEqual("2");
                expect(await subject.getItem("third")).toStrictEqual("3");
                await subject.clear();
                expect(await subject.getItem("first")).toBeUndefined();
                expect(await subject.getItem("second")).toBeUndefined();
                expect(await subject.getItem("third")).toBeUndefined();
            });
        });
    });
});
