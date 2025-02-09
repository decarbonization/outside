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

import { DepsObject } from "../hooks/Deps";
import ErrorDetails from "../components/ErrorDetails";
import renderApp from "./_renderApp";

export interface ErrorOptions {
    readonly deps: DepsObject;
    readonly error: Error;
}

export default function renderError({ deps, error }: ErrorOptions) {
    return renderApp({ deps }, (
        <>
            <ErrorDetails error={error} />
        </>
    ));
}
