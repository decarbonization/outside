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

import { useContext } from "preact/hooks";
import { linkTo } from "../../routes/_links";
import { Deps } from "../_deps";

export type SignUpMessage =
    | 'none'
    | 'duplicateEmail'
    | 'verificationEmailSent';

export interface SignUpProps {
    readonly email?: string;
    readonly message?: SignUpMessage;
}

export function SignUp({ email, message }: SignUpProps) {
    const { i18n } = useContext(Deps);
    return (
        <section className="sign-up">
            <h1>{i18n.t("accounts.signUp")}</h1>
            <p>
                {i18n.t("accounts.signUpExplanation")}
            </p>
            <form method="post" action={linkTo({ where: "signUp" })} className="v-flow spacing outset-top">
                <label for="email">{i18n.t('accounts.emailLabel')}</label>
                <input type="email" name="email" value={email} required />
                <label for="password">{i18n.t('accounts.passwordLabel')}</label>
                <input type="password" name="password" required />
                <label for="confirm_password">{i18n.t('accounts.confirmPasswordLabel')}</label>
                <input type="password" name="confirm_password" required />
                <div className="h-flow centered spacing">
                    <button type="submit">{i18n.t('accounts.signUp')}</button>
                </div>
            </form>
            <Message what={message} />
        </section>
    );
}

interface MessageProps {
    readonly what?: SignUpMessage;
}

function Message({ what = 'none' }: MessageProps) {
    const { i18n } = useContext(Deps);
    switch (what) {
        case 'none':
            return null;
        case 'duplicateEmail':
            return (
                <p className="message">{i18n.t('accounts.duplicateEmail')}</p>
            );
        case 'verificationEmailSent':
            return (
                <p className="message">{i18n.t('accounts.verificationEmailSent')}</p>
            );
    }
}
