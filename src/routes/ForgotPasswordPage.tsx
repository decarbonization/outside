/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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

import { useDeps } from "../hooks/Deps";

export default function ForgotPasswordPage() {
    const { i18n } = useDeps();
    return (
        <section className="forgot-password">
            <h1>{i18n.t("accounts.forgotPassword")}</h1>
            <form
                className="v-flow spacing outset-top"
            >
                <label for="email">{i18n.t('accounts.emailLabel')}</label>
                <input type="email" id="email" name="email" required />
                <div className="h-flow centered spacing">
                    <button className="bordered-button" type="submit">{i18n.t('accounts.submit')}</button>
                </div>
            </form>
            {false && (
                <p className="message">
                    {i18n.t('accounts.emailSent')}
                </p>
            )}
        </section>
    );
}
