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
import { SearchRoutes } from "../routes/search-routes";
import { Deps } from "./_deps";

export interface PlaceSearchProps {
    readonly query?: string;
    readonly disabled?: boolean;
}

export function PlaceSearch({ query, disabled }: PlaceSearchProps) {
    const { i18n } = useContext(Deps);
    return (
        <section className="place-search">
            <header>
                <form className="place-search-form" action={SearchRoutes.linkToGetSearchByQuery()} method="GET">
                <button class="place-search-current-location" type="button" aria-label={i18n.t('placeSearch.useCurrentLocation')} disabled>➤</button>
                    <input type="search" name="q" value={query} placeholder={i18n.t('placeSearch.inputLabel')} disabled={disabled} />
                </form>
            </header>
        </section>
    );
}
