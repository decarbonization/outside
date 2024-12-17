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
import { ErrorMessage } from "../components/error-message";

export interface ForgotPasswordProps {
    readonly email?: string;
    readonly error?: unknown;
    readonly sent?: boolean;
}

export function ForgotPassword({ email, error, sent }: ForgotPasswordProps) {
    const { i18n } = useDeps();
    return (
        <section className="forgot-password">
            <h1>{i18n.t("accounts.forgotPassword")}</h1>
            <p>
                {i18n.t("accounts.forgotPasswordExplanation")}
            </p>
            <form method="post" action={linkTo({ where: "forgotPassword" })} className="v-flow spacing outset-top">
                <label for="email">{i18n.t('accounts.emailLabel')}</label>
                <input type="email" name="email" value={email} required />
                <div className="h-flow centered spacing">
                    <button type="submit">{i18n.t('accounts.forgotPassword')}</button>
                </div>
            </form>
            <ErrorMessage error={error} />
            {sent && <p className="message">
                {i18n.t('accounts.forgotPasswordEmailSent')}
            </p>}
        </section>
    );
}
