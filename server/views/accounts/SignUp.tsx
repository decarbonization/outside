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
import { useDeps } from "../_deps";
import ErrorMessage from "../components/ErrorMessage";

export interface SignUpProps {
    readonly email?: string;
    readonly error?: unknown;
    readonly signedUp?: boolean;
    readonly returnTo?: string;
}

export default function SignUp({ email, error, signedUp, returnTo }: SignUpProps) {
    const { i18n } = useDeps();
    return (
        <section className="sign-up">
            <h1>{i18n.t("accounts.signUp")}</h1>
            <form
                method="post"
                action={linkTo({ where: "signUp", returnTo })}
                className="v-flow spacing outset-top"
            >
                <label for="email">{i18n.t('accounts.emailLabel')}</label>
                <input type="email" id="email" name="email" value={email} required />
                <label for="password">{i18n.t('accounts.passwordLabel')}</label>
                <input type="password" id="password" name="password" required />
                <label for="confirm_password">{i18n.t('accounts.confirmPasswordLabel')}</label>
                <input type="password" id="confirm_password" name="confirm_password" required />
                <div className="h-flow fully centered spacing">
                    <button className="bordered-button" type="submit">{i18n.t('accounts.signUp')}</button>
                </div>
            </form>
            <ErrorMessage error={error} />
            {signedUp && (
                <p className="message">
                    {i18n.t('accounts.emailSent')}
                </p>
            )}
        </section>
    );
}
