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

import { Account } from "../../accounts/account";
import { linkTo } from "../../routes/_links";
import { useDeps } from "../../hooks/Deps";
import Link from "../reusable/Link";
import ErrorMessage from "../reusable/ErrorMessage";

export type AccountChange =
    | 'password';

export interface AccountSettingsProps {
    readonly userAccount: Account;
    readonly error?: unknown;
    readonly success?: boolean;
    readonly changes?: AccountChange[];
}

export default function AccountSettings({ userAccount, error, changes }: AccountSettingsProps) {
    const { i18n } = useDeps();
    return (
        <section className="account-settings">
            <h1>{i18n.t('accounts.account')}</h1>
            <div className="v-flow spacing outset-top">
                <form method="post" action={linkTo({ where: "accountSettings" })} className="v-flow spacing outset-top">
                    <label for="email">{i18n.t('accounts.emailLabel')}</label>
                    <input type="email" id="email" name="email" value={userAccount.email} disabled />

                    <label for="oldPassword">{i18n.t('accounts.oldPasswordLabel')}</label>
                    <input type="password" id="oldPassword" name="oldPassword" />

                    <label for="newPassword">{i18n.t('accounts.newPasswordLabel')}</label>
                    <input type="password" id="newPassword" name="newPassword" />

                    <label for="confirmNewPassword">{i18n.t('accounts.confirmNewPasswordLabel')}</label>
                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" />

                    <button type="submit" className="bordered-button">
                        {i18n.t('accounts.submit')}
                    </button>
                </form>
                <ErrorMessage error={error} />
                {changes?.map(change => (
                    <p className="message">
                        {i18n.t(`accounts.changes.${change}`)}
                    </p>
                ))}
                <Link where="signOut">{i18n.t('accounts.signOut')}</Link>
            </div>
        </section>
    );
}