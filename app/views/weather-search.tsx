import { PlaceResults } from "../../fruitkit/apple-maps/models/places";

export interface WeatherSearchProps {
    readonly query?: string;
    readonly results?: PlaceResults;
}

export function WeatherSearch({query, results}: WeatherSearchProps) {
    return (
        <section>
            <header>
                <form className="place-search" action="/" method="GET">
                    <input type="search" name="q" value={query} placeholder="Where do you want the weather for?" />
                </form>
            </header>
            <ol className="places">
                {results?.results.map(place => (
                    <li>
                        <a href={`/weather/${place.coordinate.latitude}/${place.coordinate.longitude}?where=${place.name}`}>
                            {place.formattedAddressLines.join(", ")}
                        </a>
                    </li>
                ))}
            </ol>
        </section>
    );
}