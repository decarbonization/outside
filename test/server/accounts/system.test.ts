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
import { UserSystem } from '../../../server/accounts/system';
import { InMemoryAccountStore } from '../../../server/accounts/in-memory-store';
import { HashedPassword } from '../../../server/accounts/password';
import { ValidEmail } from '../../../server/accounts/email';

describe("accounts#system module", () => {
    describe("#UserSystem", () => {
        describe("#signUp", () => {
            it("should require a valid email", async () => {
                const subject = makeUserSystem();
                await expect(subject.signUp("me", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should require a valid password", async () => {
                const subject = makeUserSystem();
                await expect(subject.signUp("joan@real.com", "password")).rejects.toThrowError();
            });

            it("should require the user not already exist", async () => {
                const subject = makeUserSystem();
                await expect(subject.signUp("john@real.com", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should accept valid new credentials", async () => {
                const subject = makeUserSystem();
                const session = await subject.signUp("joan@real.com", "R3@ch0ut");
                expect(session.otp).not.toBeUndefined();
                expect(session.otpExpiresAt).not.toBeUndefined();
            });
        });

        describe("#signIn", () => {
            it("should require a valid email", async () => {
                const subject = makeUserSystem();
                await expect(subject.signIn("me", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should require a valid password", async () => {
                const subject = makeUserSystem();
                await expect(subject.signIn("joan@real.com", "password")).rejects.toThrowError();
            });

            it("should require the user to exist", async () => {
                const subject = makeUserSystem();
                await expect(subject.signIn("joan@real.com", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should require the password to be correct", async () => {
                const subject = makeUserSystem();
                await expect(subject.signIn("john@real.com", "N0tR3@l!")).rejects.toThrowError();
            });

            it("should return a new session with valid credentials", async () => {
                const subject = makeUserSystem();
                const session = await subject.signIn("john@real.com", "R3@ch0ut");
                expect(session.otp).toBeUndefined();
                expect(session.otpExpiresAt).toBeUndefined();
            });

            it("should generate otp for unverified user", async () => {
                const subject = makeUserSystem();
                const session = await subject.signIn("guy@real.com", "R3@ch0ut");
                expect(session.otp).not.toBeUndefined();
                expect(session.otpExpiresAt).not.toBeUndefined();
            });
        });

        describe("#signOut", () => {
            it("should require the session to exist", async () => {
                const subject = makeUserSystem();
                await expect(subject.signOut("not at all real")).rejects.toThrowError();
            });
        });

        describe("#verifyEmail", () => {
            it("should require a valid email", async () => {
                const subject = makeUserSystem();
                await expect(subject.verifyEmail("ignored", "real.com", "6CE70EE1-15C8-44FD-B163-F7AD5F9058D8")).rejects.toThrowError();
            });

            it("should require a valid password", async () => {
                const subject = makeUserSystem();
                await expect(subject.verifyEmail("ignored", "guy@real.com", "F7AD5F9058D8")).rejects.toThrowError();
            });

            it("should require session to exist", async () => {
                const subject = makeUserSystem();
                await expect(subject.verifyEmail("41A8774B-496E-4FF7-8A9F-AB09AD3407B1", "guy@real.com", "6CE70EE1-15C8-44FD-B163-F7AD5F9058D8")).rejects.toThrowError();
            });

            it.skip("should require the session to have an OTP", async () => {
                expect(false).toStrictEqual(true);
            });

            it.skip("should require the session's OTP to not be expired", async () => {
                // TODO: Write this test
                expect(false).toStrictEqual(true);
            });

            it.skip("should require the session's OTP to match", async () => {
                // TODO: Write this test
                expect(false).toStrictEqual(true);
            });

            it.skip("should require the session's user to exist", async () => {
                // TODO: Write this test
                expect(false).toStrictEqual(true);
            });

            it("should update the user and the session", async () => {
                const subject = makeUserSystem();
                const session = await subject.signUp("lady@real.com", "V1r@l1ty");

                const [beforeSession, beforeUser] = await subject.getSessionAndUser(session.id);
                expect(beforeSession?.otp).not.toBeUndefined();
                expect(beforeSession?.otpExpiresAt).not.toBeUndefined();
                expect(beforeUser?.isVerified).toStrictEqual(false);

                await subject.verifyEmail(session.id, "lady@real.com", session.otp!);

                const [afterSession, afterUser] = await subject.getSessionAndUser(session.id);
                expect(afterSession?.otp).toBeUndefined();
                expect(afterSession?.otpExpiresAt).toBeUndefined();
                expect(afterUser?.isVerified).toStrictEqual(true);
            });
        });
    });
});

function makeUserSystem(): UserSystem {
    const now = new Date();
    return new UserSystem({
        store: new InMemoryAccountStore({
            users: [
                {
                    id: 'd8d7212e-eab8-4b82-96da-37430c326b21',
                    createdAt: now,
                    email: "john@real.com" as ValidEmail,
                    password: "0b3ab4ede2053eed011ce31a16646f1c8c2e7c8c2c392cca4e2dbe14751aa442f26366301c5e3df4794cc75e7e095a4681137177be033ebf876c46d6b3a51ecf" as HashedPassword,
                    lastModified: now,
                    isVerified: true,
                },
                {
                    id: 'd8d7212e-eab8-4b82-96da-37430c326b21',
                    createdAt: now,
                    email: "guy@real.com" as ValidEmail,
                    password: "0b3ab4ede2053eed011ce31a16646f1c8c2e7c8c2c392cca4e2dbe14751aa442f26366301c5e3df4794cc75e7e095a4681137177be033ebf876c46d6b3a51ecf" as HashedPassword,
                    lastModified: now,
                    isVerified: false,
                },
            ],
        }),
        salts: ["Halo Gone Over Left"],
    });
}
