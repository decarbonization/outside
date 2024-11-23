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
import { addMinutes } from 'date-fns';
import { ValidEmail } from '../../../server/accounts/email';
import { InMemoryAccountStore } from '../../../server/accounts/in-memory-store';
import { SessionModel, UserModel } from '../../../server/accounts/models';
import { HashedPassword, token } from '../../../server/accounts/password';

describe("accounts#in-memory-user-store module", () => {
    describe("#InMemoryAccountStore", () => {
        it("should implement user lifecycle", async () => {
            const subject = new InMemoryAccountStore();

            const id = await subject.newUserID();
            const createdAt = new Date();
            const email = "hello@real.com" as ValidEmail;
            const password = "0b3ab4ede2053eed011ce31a16646f1c8c2e7c8c2c392cca4e2dbe14751aa442f26366301c5e3df4794cc75e7e095a4681137177be033ebf876c46d6b3a51ecf" as HashedPassword;
            const referenceUser: UserModel = {
                id,
                createdAt,
                email,
                password,
                lastModified: createdAt,
                isVerified: false,
            };
            await subject.insertUser(referenceUser);

            expect(await subject.getUser({ by: "id", id })).toStrictEqual(referenceUser);
            expect(await subject.getUser({ by: "email", email })).toStrictEqual(referenceUser);

            const updatedReferenceUser = {
                ...referenceUser,
                email: "goodbye@real.com" as ValidEmail,
            };
            await subject.updateUser(updatedReferenceUser);

            expect(await subject.getUser({ by: "id", id })).toStrictEqual(updatedReferenceUser);
            expect(await subject.getUser({ by: "email", email: updatedReferenceUser.email })).toStrictEqual(updatedReferenceUser);
            expect(await subject.getUser({ by: "email", email })).toBeUndefined();

            await subject.deleteUser(updatedReferenceUser);
            expect(await subject.getUser({ by: "id", id })).toBeUndefined();
        });

        it("should implement session lifecycle", async () => {
            const subject = new InMemoryAccountStore();

            const id = await subject.newSessionID();
            const createdAt = new Date();
            const userID = await subject.newUserID();
            const referenceSession: SessionModel = {
                id,
                createdAt,
                userID,
            };
            await subject.insertSession(referenceSession);

            expect(await subject.getSession(id)).toStrictEqual(referenceSession);

            const updatedSession = {
                ...referenceSession,
                token: await token(),
                tokenExpiresAt: addMinutes(new Date(), 15),
            };
            await subject.updateSession(updatedSession);

            expect(await subject.getSession(id)).toStrictEqual(updatedSession);

            await subject.deleteSession(id);

            expect(await subject.getSession(id)).toBeUndefined();
        });

        it("should implement setting lifecycle", async () => {
            const subject = new InMemoryAccountStore();
            const userID = await subject.newUserID();

            expect(await subject.getSettings(userID, ['units', 'tz'])).toStrictEqual([]);

            await subject.putSettings([
                { userID, name: 'units', value: 'm' },
            ]);

            expect(await subject.getSettings(userID, ['units', 'tz'])).toStrictEqual([
                { userID, name: 'units', value: 'm' },
            ]);

            await subject.putSettings([
                { userID, name: 'units', value: 'us' },
                { userID, name: 'tz', value: 'UTC' },
            ]);

            expect(await subject.getSettings(userID, ['units', 'tz'])).toStrictEqual([
                { userID, name: 'units', value: 'us' },
                { userID, name: 'tz', value: 'UTC' },
            ]);

            expect([...await subject.deleteSettings(userID, ['units'])]).toStrictEqual(['units']);

            expect(await subject.getSettings(userID, ['units', 'tz'])).toStrictEqual([
                { userID, name: 'tz', value: 'UTC' },
            ]);
        });
    });
});
