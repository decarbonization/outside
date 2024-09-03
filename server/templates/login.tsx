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
import { renderApp } from "./_app";

export interface LoginOptions {
    readonly deps: DepsObject;
    readonly email?: string;
    readonly sentEmail?: boolean;
}

export function renderLogin({ deps, email, sentEmail }: LoginOptions): string {
    return renderApp({ deps }, (
        <section className="login">
            <form method="post" action={linkTo({ where: "login" })}>
                <label for="email">Email</label>
                <input type="email" name="email" value={email} />
                <input type="submit" />
            </form>
            {sentEmail === true
                ? <p>Email sent, check your inbox</p>
                : null}
        </section>
    ));
}
