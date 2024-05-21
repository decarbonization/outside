import { ErrorRequestHandler } from "express";
import { loadTheme } from "../styling/themes";
import { renderError } from "../templates/_error";
import { DepsObject } from "../views/_deps";

export interface ErrorMiddlewareOptions {
    
}

export function ErrorMiddleware({}: ErrorMiddlewareOptions): ErrorRequestHandler {
    return async (error: Error, req, res, _next): Promise<void> => {
        console.error(`${req.method} ${req.url}: ${error.message}`, error.stack);
        const deps: DepsObject = {
            i18n: req.i18n,
            theme: await loadTheme(),
        };
        const resp = renderError({ deps, error });
        res.status(500).type("html").send(resp);
    };
}
