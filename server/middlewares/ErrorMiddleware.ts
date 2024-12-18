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

import { ErrorRequestHandler } from "express";
import renderError from "../templates/_renderError";
import { makeDeps } from "../hooks/Deps";

export interface ErrorMiddlewareOptions {

}

export default function ErrorMiddleware({ }: ErrorMiddlewareOptions): ErrorRequestHandler {
    return async (error: Error, req, res, _next): Promise<void> => {
        console.error(`${req.method} ${req.url}: ${error.message}`, error.stack);
        const deps = await makeDeps({ req });
        const resp = renderError({ deps, error });
        res.status(500).type("html").send(resp);
    };
}
