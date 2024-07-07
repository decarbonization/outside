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

import { FetchFunction, FruitToken } from "fruit-company";

export interface AirNowTokenOptions {
    readonly apiKey: string;
}

export class AirNowToken implements FruitToken {
    constructor(
        private readonly apiKey: string
    ) {
    }

    /**
     * @ignore
     */
    _decorate(url: URL): void {
        url.searchParams.set("api_key", this.apiKey);
    }

    get retryLimit(): number {
        return 0;
    }
    get isValid(): boolean {
        return false;
    }

    async refresh(_fetch: FetchFunction): Promise<void> {
        // No-op.
        return undefined;
    }
}