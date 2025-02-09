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

import { Account } from "../accounts/account";
import AccountSettings, { AccountChange } from "../components/accounts/AccountSettings";
import { DepsObject } from "../hooks/Deps";
import renderApp from "./_renderApp";

export interface AccountSettingsOptions {
    readonly deps: DepsObject;
    readonly userAccount: Account;
    readonly error?: unknown;
    readonly changes?: AccountChange[];
}

export default function renderAccountSettings({ deps, userAccount, error, changes }: AccountSettingsOptions): string {
    return renderApp({ deps }, (
        <AccountSettings
            userAccount={userAccount}
            error={error}
            changes={changes} />
    ));
}
