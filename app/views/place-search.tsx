/*
 * outside weather app
 * Copyright (C) 2014  Peter "Kevin" Contreras
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

import { t } from "i18next";
import { PlaceResults } from "../../fruit-company/maps/models/places";

export interface PlaceSearchProps {
    readonly query?: string;
    readonly results?: PlaceResults;
}

export function PlaceSearch({query, results}: PlaceSearchProps) {
    return (
        <section className="place-search">
            <header>
                <form action="/" method="GET">
                    <input type="search" name="q" value={query} placeholder={t('placeSearch.inputLabel')} />
                </form>
            </header>
            <ol>
                {results?.results.map(place => (
                    <li>
                        <a href={`/weather/${place.countryCode}/${place.coordinate.latitude}/${place.coordinate.longitude}?q=${place.name}`}>
                            {place.formattedAddressLines.join(", ")}
                        </a>
                    </li>
                ))}
            </ol>
        </section>
    );
}
