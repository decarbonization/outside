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
import { Deps } from "./_deps";

export interface GlobalHeaderProps {
    readonly searchQuery?: string;
    readonly searchDisabled?: boolean;
}

export function GlobalHeader({ searchQuery, searchDisabled }: GlobalHeaderProps) {
    const { i18n } = useContext(Deps);
    return (
        <header className="global h-flow spacing">
            <div className="sidekick">
                {i18n.t('appName')}
            </div>
            <form className="place-search-form" action={linkTo({ where: "searchByQuery" })} method="GET">
                <button class="place-search-current-location" type="button" aria-label={i18n.t('placeSearch.useCurrentLocation')} disabled>➤</button>
                <input type="search" name="q" value={searchQuery} placeholder={i18n.t('placeSearch.inputLabel')} disabled={searchDisabled} />
            </form>
        </header>
    );
}
