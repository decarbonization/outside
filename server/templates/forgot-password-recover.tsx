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

import { DepsObject } from "../views/_deps";
import ForgotPasswordRecover from "../views/accounts/ForgotPasswordRecover";
import renderApp from "./_app";

export interface ForgotPasswordRecoverOptions {
    readonly deps: DepsObject;
    readonly sessionID: number;
    readonly token: string;
    readonly error?: unknown;
}

export default function renderForgotPasswordRecover({ deps, sessionID, token, error }: ForgotPasswordRecoverOptions): string {
    return renderApp({ deps }, (
        <ForgotPasswordRecover
            sessionID={sessionID}
            token={token}
            error={error} />
    ));
}

