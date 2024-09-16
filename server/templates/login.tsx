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

export type LoginMessage =
    | 'none'
    | 'emailSent'
    | 'noSuchUser';

export interface LoginOptions {
    readonly deps: DepsObject;
    readonly email?: string;
    readonly message?: LoginMessage;
}

export function renderLogin({ deps, email, message }: LoginOptions): string {
    return renderApp({ deps }, (
        <section className="login">
            <p className="intro">{deps.i18n.t('session.intro')}</p>
            <form method="post" action={linkTo({ where: "login" })}>
                <label for="email">{deps.i18n.t('session.emailLabel')}</label>
                <input type="email" name="email" value={email} />
                <button type="submit">{deps.i18n.t('session.submit')}</button>
            </form>
            <Message what={message} />
        </section>
    ));
}

interface MessageProps {
    readonly what?: LoginMessage;
}

function Message({ what = 'none' }: MessageProps) {
    const { i18n } = useContext(Deps);
    switch (what) {
        case 'none':
            return null;
        case 'emailSent':
            return (
                <p className="message">{i18n.t('session.emailSent')}</p>
            );
        case 'noSuchUser':
            return (
                <p className="message">{i18n.t('session.noSuchUser')}</p>
            );
    }
}
