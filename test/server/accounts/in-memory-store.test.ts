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
import { HashedPassword, token } from '../../../server/accounts/password';
import { UserID } from '../../../server/accounts/schemas';

describe("accounts#in-memory-user-store module", () => {
    describe("#InMemoryAccountStore", () => {
        it("should implement user lifecycle", async () => {
            const subject = new InMemoryAccountStore();

            const initialUser = await subject.insertUser({
                email: "hello@real.com" as ValidEmail,
                password: "0b3ab4ede2053eed011ce31a16646f1c8c2e7c8c2c392cca4e2dbe14751aa442f26366301c5e3df4794cc75e7e095a4681137177be033ebf876c46d6b3a51ecf" as HashedPassword,
                isVerified: false,
                scopes: [],
            });

            expect(await subject.getUser({ by: "id", id: initialUser.id })).toStrictEqual(initialUser);
            expect(await subject.getUser({ by: "email", email: initialUser.email })).toStrictEqual(initialUser);

            const updatedUser = {
                ...initialUser,
                email: "goodbye@real.com" as ValidEmail,
            };
            await subject.updateUser(updatedUser);

            expect(await subject.getUser({ by: "id", id: initialUser.id })).toStrictEqual(updatedUser);
            expect(await subject.getUser({ by: "email", email: updatedUser.email })).toStrictEqual(updatedUser);
            expect(await subject.getUser({ by: "email", email: initialUser.email })).toBeUndefined();

            await subject.deleteUser(updatedUser);
            expect(await subject.getUser({ by: "id", id: initialUser.id })).toBeUndefined();
        });

        it("should implement session lifecycle", async () => {
            const subject = new InMemoryAccountStore();

            const initialSession = await subject.insertSession({
                userID: 0,
            });

            expect(await subject.getSession(initialSession.id)).toStrictEqual(initialSession);

            const updatedSession = {
                ...initialSession,
                token: await token(),
                tokenExpiresAt: addMinutes(new Date(), 15),
            };
            await subject.updateSession(updatedSession);

            expect(await subject.getSession(initialSession.id)).toStrictEqual(updatedSession);

            await subject.deleteSession(initialSession.id);

            expect(await subject.getSession(initialSession.id)).toBeUndefined();
        });

        it("should implement setting lifecycle", async () => {
            const subject = new InMemoryAccountStore();

            const userID: UserID = 0;
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
