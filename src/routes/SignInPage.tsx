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

import { useLocation } from "preact-iso";
import { signIn } from "../api/fetches";
import Link from "../components/reusable/Link";
import { useDeps } from "../hooks/Deps";
import { invalidateFetch } from "../hooks/Fetch";
import { linkTo } from "./_links";

export default function SignInPage() {
    const { i18n } = useDeps();
    const location = useLocation();
    return (
        <section className="sign-in">
            <h1>{i18n.t("accounts.signIn")}</h1>
            <form
                className="v-flow spacing outset-top"
                onSubmit={async e => {
                    e.stopPropagation();
                    e.preventDefault();

                    const form = e.currentTarget;
                    if (!form.reportValidity()) {
                        return;
                    }
            
                    const formData = new FormData(form);
                    await signIn({
                        email: formData.get("email") as string,
                        password: formData.get("password") as string,
                    });
                    invalidateFetch(["getAccount"]);
                    location.route(linkTo({ where: "index" }), true);
        
                }}
            >
                <label for="email">{i18n.t('accounts.emailLabel')}</label>
                <input type="email" id="email" name="email" required />
                <label for="password">{i18n.t('accounts.passwordLabel')}</label>
                <input type="password" id="password" name="password" required />
                <div className="h-flow fully centered spacing">
                    <Link className="button-like" where="forgotPassword">{i18n.t('accounts.forgotPassword')}</Link>
                    <button className="bordered-button" type="submit">{i18n.t('accounts.signIn')}</button>
                </div>
            </form>
        </section>
    );
}
