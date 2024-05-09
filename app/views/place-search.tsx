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
