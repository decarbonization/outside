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
import { PlaceResults } from "../../fruit-company/maps/models/places";
import { Deps } from "./_deps";
import { truncateLocationCoordinates } from "../../fruit-company/maps/models/base";

export interface PlaceSearchProps {
    readonly query?: string;
    readonly results?: PlaceResults;
    readonly disabled?: boolean;
}

export function PlaceSearch({ query, results, disabled }: PlaceSearchProps) {
    const { i18n } = useContext(Deps);
    return (
        <section className="place-search">
            <header>
                <form className="place-search-form" action="/" method="GET">
                    <input type="search" name="q" value={query} placeholder={i18n.t('placeSearch.inputLabel')} disabled={disabled} />
                </form>
            </header>
            <ol className="place-results">
                {results?.results.map(place => {
                    const { countryCode, name } = place;
                    const { longitude, latitude } = truncateLocationCoordinates(place.coordinate, 3);
                    return (
                        <li className="place-result">
                            <a href={`/weather/${countryCode}/${latitude}/${longitude}?q=${name}`}>
                                {place.formattedAddressLines.join(", ")}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
