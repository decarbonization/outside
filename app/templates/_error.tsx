import { DepsObject } from "../views/_deps";
import { ErrorDetails } from "../views/error-details";
import { renderApp } from "./_app";

export interface ErrorOptions {
    readonly deps: DepsObject;
    readonly error: Error;
}

export function renderError({ deps, error }: ErrorOptions) {
    return renderApp({ deps }, (
        <>
            <ErrorDetails error={error} />
        </>
    ));
}
