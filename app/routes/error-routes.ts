import { NextFunction, Request, Response, Router } from "express";
import { loadTheme } from "../styling/themes";
import { renderError } from "../templates/_error";
import { DepsObject } from "../views/_deps";

export function ErrorRoutes(): Router {
    return Router()
        .use((error: Error, req: Request, res: Response, _next: NextFunction): void => {
            (async () => {
                const deps: DepsObject = {
                    i18n: req.i18n,
                    theme: await loadTheme(),
                };
                console.error(error.message, error.stack);
                const resp = renderError({ deps, error });
                res.status(500).type("html").send(resp);
            })();
        });
}
