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

export default function ForgotPasswordRecoverPage() {
    const { i18n } = useDeps();
    return (
        <section className="forgot-password-recover">
            <form className="v-flow spacing outset-top">
                <label for="password">{i18n.t('accounts.passwordLabel')}</label>
                <input type="password" id="password" name="password" required />
                <label for="confirm_password">{i18n.t('accounts.confirmPasswordLabel')}</label>
                <input type="password" id="confirm_password" name="confirm_password" required />
                <div className="h-flow centered spacing">
                    <button className="bordered-button" type="submit">{i18n.t('accounts.submit')}</button>
                </div>
            </form>
        </section>
    );
}
