import { PlaceResults } from "../../fruit-company/maps/models/places";
import { DepsObject } from "../views/_deps";
import { PlaceSearch } from "../views/place-search";
import { renderApp } from "./_app";

export interface IndexOptions {
    readonly deps: DepsObject;
    readonly query?: string;
    readonly results?: PlaceResults;
}

export function renderIndex({ deps, query, results }: IndexOptions): string {
    return renderApp({ deps }, (
        <>
            <PlaceSearch query={query} results={results} />
        </>
    ));
}
