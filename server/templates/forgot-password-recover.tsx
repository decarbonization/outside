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

import { linkTo } from "../routes/_links";
import { DepsObject } from "../views/_deps";
import { ErrorMessage } from "../views/components/error-message";
import { renderApp } from "./_app";

export interface ForgotPasswordRecoverOptions {
    readonly deps: DepsObject;
    readonly sessionID: number;
    readonly token: string;
    readonly error?: unknown;
}

export function renderForgotPasswordRecover({ deps, sessionID, token, error }: ForgotPasswordRecoverOptions): string {
    return renderApp({ deps }, (
        <section className="forgot-password-recover">
            <form method="post" action={linkTo({ where: "forgotPasswordRecover", sid: sessionID, token })} className="v-flow spacing outset-top">
                <label for="password">Password</label>
                <input type="password" name="password" required />
                <label for="confirm_password">Confirm Password</label>
                <input type="password" name="confirm_password" required />
                <div className="h-flow centered spacing">
                    <button type="submit">Change Password</button>
                </div>
            </form>
            <ErrorMessage error={error} />
        </section>
    ));
}
