/*
 * outside weather app
 * Copyright (C) 2024  MAINTAINERS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { describe, expect, it } from '@jest/globals';
import { checkPassword, hashPassword, isValidOTP, isValidPassword, ValidPassword } from '../../../server/accounts/password';

describe("accounts#password module", () => {
    describe("#isValidPassword", () => {
        it("should require at least 8 characters", () => {
            expect(isValidPassword("")).toStrictEqual(false);
            expect(isValidPassword("R3@ch0u")).toStrictEqual(false);
        });

        it("should require at least one symbol", () => {
            expect(isValidPassword("R3ach0ut")).toStrictEqual(false);
        });

        it("should require at least one uppercase letter", () => {
            expect(isValidPassword("r3@ch0ut")).toStrictEqual(false);
        });

        it("should require at least one lowercase letter", () => {
            expect(isValidPassword("R3@CH0UT")).toStrictEqual(false);
        });

        it("should require at least one number", () => {
            expect(isValidPassword("Re@chOut")).toStrictEqual(false);
        });

        it("should accept a valid password", () => {
            expect(isValidPassword("R3@ch0ut")).toStrictEqual(true);
        });
    });

    describe("#isValidOTP", () => {
        it("should reject non-UUID values", () => {
            expect(isValidOTP("hello")).toStrictEqual(false);
            expect(isValidOTP("751C0036-986F-4DD4-B8DB")).toStrictEqual(false);
            expect(isValidOTP("751C0036986F4DD4B8DB32B3CD164FD0")).toStrictEqual(false);
        });

        it("should accept a valid UUID", () => {
            expect(isValidOTP("63f4a63a-cb39-40db-a932-49719fa5d889")).toStrictEqual(true);
        });
    });

    describe("#hashPassword", () => {
        it("should require a valid salt", async () => {
            await expect(hashPassword("R3@ch0ut" as ValidPassword, "")).rejects.toThrowError();
        });

        it("should hash passwords", async () => {
            expect(await hashPassword("R3@ch0ut" as ValidPassword, "Halo Gone Over Left")).toStrictEqual("0b3ab4ede2053eed011ce31a16646f1c8c2e7c8c2c392cca4e2dbe14751aa442f26366301c5e3df4794cc75e7e095a4681137177be033ebf876c46d6b3a51ecf");
        });
    });

    describe("#checkPassword", () => {
        it("should require at least one salt", async () => {
            const input = "R3@ch0ut" as ValidPassword;
            const subject = await hashPassword(input, "Halo Gone Over Left");
            await expect(checkPassword(subject, input, [])).rejects.toThrowError();
        });

        it("should try multiple salts", async () => {
            const input = "R3@ch0ut" as ValidPassword;
            const subject = await hashPassword(input, "Halo Gone Over Left");
            expect(await checkPassword(subject, input, [
                "Old South Tavern Call",
                "Let's Get Some Shoes",
                "Halo Gone Over Left",
            ])).toStrictEqual(true);
        });

        it("should reject passwords that don't match any salt", async () => {
            const input = "R3@ch0ut" as ValidPassword;
            const subject = await hashPassword(input, "One Off Whatever Thing");
            expect(await checkPassword(subject, input, [
                "Old South Tavern Call",
                "Let's Get Some Shoes",
                "Halo Gone Over Left",
            ])).toStrictEqual(false);
        });
    });
});
