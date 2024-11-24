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
import { linkTo } from "../routes/_links";
import { Deps, DepsObject } from "../views/_deps";
import { renderApp } from "./_app";

export type SignUpMessage =
    | 'none'
    | 'duplicateEmail'
    | 'verificationEmailSent';

export interface SignUpOptions {
    readonly deps: DepsObject;
    readonly email?: string;
    readonly message?: SignUpMessage;
}

export function renderSignUp({ deps, email, message }: SignUpOptions): string {
    return renderApp({ deps }, (
        <section className="sign-up">
            <form method="post" action={linkTo({ where: "signUp" })}>
                <label for="email">{deps.i18n.t('accounts.emailLabel')}</label>
                <input type="email" name="email" value={email} required />
                <label for="password">{deps.i18n.t('accounts.passwordLabel')}</label>
                <input type="password" name="password" required />
                <label for="confirm_password">{deps.i18n.t('accounts.confirmPasswordLabel')}</label>
                <input type="password" name="confirm_password" required />
                <button type="submit">{deps.i18n.t('accounts.submit')}</button>
            </form>
            <Message what={message} />
        </section>
    ));
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
