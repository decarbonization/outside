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

import { envFlag } from "../utilities/env";
import { DepsObject } from "../hooks/Deps";
import Condition from "../components/reusable/Condition";
import Link from "../components/reusable/Link";
import renderApp from "./_app";

export interface IndexOptions {
    readonly deps: DepsObject;
    readonly searchQuery?: string;
}

export default function renderIndex({ deps, searchQuery }: IndexOptions): string {
    const { i18n, isUserLoggedIn } = deps;
    return renderApp({ deps, searchQuery }, (
        <>
            <section className="overview">
                <div className="h-flow spacing centered hero">
                    <Condition code="Clear" />
                    <Condition code="Rain" daylight={false} />
                    <Condition code="Snow" />
                </div>
                <p className="callout">
                    {i18n.t('appDescription')}
                </p>
            </section>
            <section className="cta outset-top h-flow centered spacing">
                {isUserLoggedIn ? (
                    <button className="bordered-button use-current-location" type="button" disabled>
                        {i18n.t('placeSearch.useCurrentLocation')}
                    </button>
                ) : (
                    <>
                        <Link className="bordered-button" where="signIn">{i18n.t('accounts.signIn')}</Link>
                        {!envFlag("DISABLE_SIGN_UP", false) && <Link className="bordered-button" where="signUp">{i18n.t('accounts.signUp')}</Link>}
                    </>
                )}
            </section>
        </>
    ));
}
