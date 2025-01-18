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

import { linkTo } from "../routes/_links";
import { useDeps } from "../hooks/Deps";
import Link from "./reusable/Link";
import { useSession } from "../hooks/Session";

export interface NavigationBarProps {
    readonly searchQuery?: string;
    readonly searchDisabled?: boolean;
}

export default function NavigationBar({ searchQuery, searchDisabled }: NavigationBarProps) {
    const { i18n } = useDeps();
    const { isLoggedIn } = useSession();
    return (
        <header className="global">
            <nav className="h-flow spacing fully centered">
                <Link where="index" noRedirect className="logo">
                    {i18n.t('appName')}
                </Link>
                {isLoggedIn ? (
                    <>
                        <form className="place-search-form" action={linkTo({ where: "searchByQuery" })} method="GET">
                            <button class="place-search-location use-current-location" type="button" disabled>
                                {i18n.t('placeSearch.useCurrentLocation')}
                            </button>
                            <input type="search" name="q" value={searchQuery} placeholder={i18n.t('placeSearch.inputLabel')} disabled={searchDisabled} />
                        </form>
                        <Link where="accountSettings">{i18n.t('accounts.me')}</Link>
                    </>
                ) : (
                    <>
                        <div className="flexible-spacer" />
                        <Link where="signIn">{i18n.t('accounts.signIn')}</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
