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
import ForgotPassword from "../components/accounts/ForgotPassword";
import renderApp from "./_renderApp";

export interface ForgotPasswordOptions {
    readonly deps: DepsObject;
    readonly email?: string;
    readonly error?: unknown;
    readonly sent?: boolean;
}

export default function renderForgotPassword({ deps, email, error, sent }: ForgotPasswordOptions): string {
    return renderApp({ deps }, (
        <ForgotPassword
            email={email}
            error={error}
            sent={sent} />
    ));
}
