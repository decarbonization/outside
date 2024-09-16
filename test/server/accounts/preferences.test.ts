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
import { UserPreferences } from '../../../server/accounts/preferences';
import { inMemoryUserObjects } from '../../../server/accounts/backends/in-memory';
import { UserID } from '../../../server/accounts/users';

describe("accounts#preferences module", () => {
    describe("#UserPreferences", () => {
        it("should read and write back to store", async () => {
            const [_users, _sessions, preferences] = inMemoryUserObjects([
                { uid: 0, lastModified: new Date(), email: "test@localhost" },
            ]);
            const subject = new UserPreferences(0 as UserID, preferences);
            expect(Array.from((await subject.set({ timeZone: "UTC" })))).toStrictEqual(["timeZone"]);
            expect(await subject.get("timeZone")).toStrictEqual({ timeZone: "UTC" });
            expect(Array.from((await subject.delete("timeZone")))).toStrictEqual(["timeZone"]);
            expect(await subject.get("timeZone")).toStrictEqual({});
        });

        it("should tolerate having no uid", async () => {
            const [_users, _sessions, preferences] = inMemoryUserObjects([]);
            const subject = new UserPreferences(undefined, preferences);
            expect(Array.from((await subject.set({ timeZone: "UTC" })))).toStrictEqual([]);
            expect(Array.from((await subject.delete("timeZone")))).toStrictEqual([]);
            expect(await subject.get("timeZone")).toStrictEqual({});
        });
    });
});
