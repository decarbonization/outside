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

import { ComponentChildren } from "preact";
import render from "preact-render-to-string";
import { App } from "../views/_app";
import { Deps, DepsObject } from "../views/_deps";

const templatePrelude = "<!DOCTYPE html>";

export interface RenderAppOptions {
    readonly className?: string;
    readonly deps: DepsObject;
}

export function renderApp(
    { className, deps }: RenderAppOptions,
    children: ComponentChildren
): string {
    return templatePrelude + render(
        <Deps.Provider value={deps}>
            <App className={className}>
                {children}
            </App>
        </Deps.Provider>
    );
}