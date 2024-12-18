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

import { linkTo } from "../../routes/_links";
import { useDeps } from "../../hooks/Deps";
import ErrorMessage from "../reusable/ErrorMessage";
import Link from "../reusable/Link";

export interface SignInProps {
    readonly email?: string;
    readonly error?: unknown;
    readonly returnTo?: string;
}

export default function SignIn({ email, error, returnTo }: SignInProps) {
    const { i18n } = useDeps();
    return (
        <section className="sign-in">
            <h1>{i18n.t("accounts.signIn")}</h1>
            <form
                method="post"
                action={linkTo({ where: "signIn", returnTo })}
                className="v-flow spacing outset-top"
            >
                <label for="email">{i18n.t('accounts.emailLabel')}</label>
                <input type="email" id="email" name="email" value={email} required />
                <label for="password">{i18n.t('accounts.passwordLabel')}</label>
                <input type="password" id="password" name="password" required />
                <div className="h-flow fully centered spacing">
                    <Link className="button-like" where="forgotPassword">{i18n.t('accounts.forgotPassword')}</Link>
                    <button className="bordered-button" type="submit">{i18n.t('accounts.signIn')}</button>
                </div>
            </form>
            <ErrorMessage error={error} />
        </section>
    );
}
