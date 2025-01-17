/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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

import { describe, expect, it } from 'vitest';
import { ValidEmail } from './email';
import { InMemoryAccountStore } from './in-memory-store';
import { HashedPassword } from './password';
import { AccountStore } from './store';
import { UserSystem } from './system';

describe("accounts#system module", () => {
    describe("#UserSystem", () => {
        describe("#signUp", () => {
            it("should require a valid email", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.signUp("me", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should require a valid password", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.signUp("joan@real.com", "password")).rejects.toThrowError();
            });

            it("should require the user not already exist", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.signUp("john@real.com", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should accept valid new credentials", async () => {
                const [_, subject] = makeUserSystem();
                const session = await subject.signUp("joan@real.com", "R3@ch0ut");
                expect(session.token).not.toBeUndefined();
                expect(session.tokenExpiresAt).not.toBeUndefined();
            });
        });

        describe("#signIn", () => {
            it("should require a valid email", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.signIn("me", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should require a valid password", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.signIn("joan@real.com", "password")).rejects.toThrowError();
            });

            it("should require the user to exist", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.signIn("joan@real.com", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should require the password to be correct", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.signIn("john@real.com", "N0tR3@l!")).rejects.toThrowError();
            });

            it("should return a new session with valid credentials", async () => {
                const [_, subject] = makeUserSystem();
                const session = await subject.signIn("john@real.com", "R3@ch0ut");
                expect(session.token).toBeUndefined();
                expect(session.tokenExpiresAt).toBeUndefined();
            });

            it("should generate token for unverified user", async () => {
                const [_, subject] = makeUserSystem();
                const session = await subject.signIn("guy@real.com", "R3@ch0ut");
                expect(session.token).not.toBeUndefined();
                expect(session.tokenExpiresAt).not.toBeUndefined();
            });
        });

        describe("#signOut", () => {
            it("should require the session to exist", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.signOut(8675309)).rejects.toThrowError();
            });
        });

        describe("#verifyEmail", () => {
            it("should require a valid email", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.verifyEmail(-1, "real.com", "6CE70EE1-15C8-44FD-B163-F7AD5F9058D8")).rejects.toThrowError();
            });

            it("should require a valid password", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.verifyEmail(-1, "guy@real.com", "F7AD5F9058D8")).rejects.toThrowError();
            });

            it("should require session to exist", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.verifyEmail(8675309, "guy@real.com", "6CE70EE1-15C8-44FD-B163-F7AD5F9058D8")).rejects.toThrowError();
            });

            it.skip("should require the session to have an token", async () => {
                expect(false).toStrictEqual(true);
            });

            it.skip("should require the session's token to not be expired", async () => {
                // TODO: Write this test
                expect(false).toStrictEqual(true);
            });

            it.skip("should require the session's token to match", async () => {
                // TODO: Write this test
                expect(false).toStrictEqual(true);
            });

            it.skip("should require the session's user to exist", async () => {
                // TODO: Write this test
                expect(false).toStrictEqual(true);
            });

            it("should update the user and the session", async () => {
                const [store, subject] = makeUserSystem();
                const session = await subject.signUp("lady@real.com", "V1r@l1ty");

                const beforeSession = await store.getSession(session.id);
                const beforeUser = await store.getUser({ by: "id", id: session.userID });
                expect(beforeSession?.token).not.toBeUndefined();
                expect(beforeSession?.tokenExpiresAt).not.toBeUndefined();
                expect(beforeSession?.tokenScopes).not.toBeUndefined();
                expect(beforeUser?.isVerified).toStrictEqual(false);

                await subject.verifyEmail(session.id, "lady@real.com", session.token!);

                const afterSession = await store.getSession(session.id);
                const afterUser = await store.getUser({ by: "id", id: session.userID });
                expect(afterSession?.token).toBeUndefined();
                expect(afterSession?.tokenExpiresAt).toBeUndefined();
                expect(afterSession?.tokenScopes).toBeUndefined();
                expect(afterUser?.isVerified).toStrictEqual(true);
            });
        });

        describe("#beginForgotPassword", () => {
            it("should require a valid email", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.beginForgotPassword("real.com")).rejects.toThrowError();
            });

            it("should require a user to exist", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.beginForgotPassword("not@real.com")).rejects.toThrowError();
            });

            it("should create a session with the required scope", async () => {
                const [_, subject] = makeUserSystem();
                const session = await subject.beginForgotPassword("john@real.com");
                expect(session.token).not.toBeUndefined();
                expect(session.tokenExpiresAt).not.toBeUndefined();
                expect(session.tokenScopes).toStrictEqual(['verifyPassword', 'recoverPassword'])
            });
        });

        describe("#finishForgotPassword", () => {
            it("should require a valid password", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.finishForgotPassword(-1, "", "bad password")).rejects.toThrowError();
            });

            it("should require session to exist", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.finishForgotPassword(-1, "2B91796E-E9D3-4FC9-B6EF-5E1C1B7ACAA1", "R3@ch0ut")).rejects.toThrowError();
            });

            it("should update the user's password", async () => {
                const [store, subject] = makeUserSystem();
                const beforeSession = await subject.beginForgotPassword("john@real.com");
                const beforeUser = await store.getUser({ by: "id", id: beforeSession.userID });
                const afterSession = await subject.finishForgotPassword(beforeSession.id, beforeSession.token!, "V1r@l1ty");
                const afterUser = await store.getUser({ by: "id", id: beforeSession.userID });
                expect(afterSession.token).not.toStrictEqual(beforeSession.token);
                expect(afterSession.tokenExpiresAt).not.toStrictEqual(beforeSession.tokenExpiresAt);
                expect(afterSession.tokenScopes).not.toStrictEqual(beforeSession.tokenScopes);
                expect(afterUser?.password).not.toStrictEqual(beforeUser?.password)
            });
        });

        describe("#changePassword", () => {
            it("should require the old password to be valid", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.changePassword(0, "password", "V1r@l1ty")).rejects.toThrowError();
            });

            it("should require the new password to be valid", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.changePassword(0, "R3@ch0ut", "password")).rejects.toThrowError();
            });

            it("should require the user to exist", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.changePassword(-1, "R3@ch0ut", "V1r@l1ty")).rejects.toThrowError();
            });

            it("should require the old password to match", async () => {
                const [_, subject] = makeUserSystem();
                await expect(subject.changePassword(-1, "N0tR3@l!", "V1r@l1ty")).rejects.toThrowError();
            });

            it("should update the user's password", async () => {
                const [store, subject] = makeUserSystem();
                const beforeUser = await store.getUser({ by: "id", id: 0 });
                await subject.changePassword(0, "R3@ch0ut", "V1r@l1ty")
                const afterUser = await store.getUser({ by: "id", id: 0 });
                expect(afterUser?.password).not.toStrictEqual(beforeUser?.password)
            });
        });
    });
});

function makeUserSystem(): [AccountStore, UserSystem] {
    const store = new InMemoryAccountStore({
        users: [
            {
                id: 0,
                email: "john@real.com" as ValidEmail,
                password: "0b3ab4ede2053eed011ce31a16646f1c8c2e7c8c2c392cca4e2dbe14751aa442f26366301c5e3df4794cc75e7e095a4681137177be033ebf876c46d6b3a51ecf" as HashedPassword,
                isVerified: true,
                scopes: [],
            },
            {
                id: 1,
                email: "guy@real.com" as ValidEmail,
                password: "0b3ab4ede2053eed011ce31a16646f1c8c2e7c8c2c392cca4e2dbe14751aa442f26366301c5e3df4794cc75e7e095a4681137177be033ebf876c46d6b3a51ecf" as HashedPassword,
                isVerified: false,
                scopes: [],
            },
        ],
    });
    const salts = [
        "Halo Gone Over Left",
    ]
    const system = new UserSystem({ store, salts });
    return [store, system];
}
