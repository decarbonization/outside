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

import { camelCaseToVariable } from "./transforms";

export type DynamicClassName = string & { readonly __tag: unique symbol };

export interface DynamicClassVariables {
    readonly [key: string]: string;
}

export function dynamic(className: string): DynamicClassName {
    return className as unknown as DynamicClassName;
}

export function resolve(className: DynamicClassName, variables: DynamicClassVariables): string {
    let result = className as string;
    for (const [key, value] of Object.entries(variables)) {
        const variableName = camelCaseToVariable(key);
        result = result.replace(variableName, value);
    }
    return result;
}
