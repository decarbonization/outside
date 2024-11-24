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

export type SignInMessage =
    | 'none'
    | 'noSuchUser';

export interface SignInProps {
    readonly email?: string;
    readonly message?: SignInMessage;
    readonly returnTo?: string;
}

export function SignIn({ email, message, returnTo }: SignInProps) {
    const { i18n } = useContext(Deps);
    return (
        <section className="sign-in">
            <h1>{i18n.t("accounts.signIn")}</h1>
            <form method="post" action={linkTo({ where: "signIn", returnTo })} className="v-flow spacing outset-top">
                <label for="email">{i18n.t('accounts.emailLabel')}</label>
                <input type="email" name="email" value={email} />
                <label for="password">{i18n.t('accounts.passwordLabel')}</label>
                <input type="password" name="password" />
                <div className="h-flow centered spacing">
                    <button type="button">{i18n.t('accounts.forgotPassword')}</button>
                    <button type="submit">{i18n.t('accounts.signIn')}</button>
                </div>
            </form>
            <Message what={message} />
        </section>
    );
}

interface MessageProps {
    readonly what?: SignInMessage;
}

function Message({ what = 'none' }: MessageProps) {
    const { i18n } = useContext(Deps);
    switch (what) {
        case 'none':
            return null;
        case 'noSuchUser':
            return (
                <p className="message">{i18n.t('accounts.noSuchUser')}</p>
            );
    }
}
