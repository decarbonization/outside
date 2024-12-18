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

import { DepsObject } from "../hooks/Deps";
import SignIn from "../components/accounts/SignIn";
import renderApp from "./_app";

export interface SignInOptions {
    readonly deps: DepsObject;
    readonly email?: string;
    readonly error?: unknown;
    readonly returnTo?: string;
}

export default function renderSignIn({ deps, email, error, returnTo }: SignInOptions): string {
    return renderApp({ deps }, (
        <SignIn
            email={email}
            error={error}
            returnTo={returnTo} />
    ));
}
