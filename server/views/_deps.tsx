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

import { Request } from "express";
import { i18n } from "i18next";
import { ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";
import { LocationCoordinates } from "serene-front/data";
import { mapIfNotUndefined } from "../utilities/maybe";
import { timezoneFor } from "../utilities/weather-utils";

/**
 * Encapsulates the dependencies made available to components in this app.
 */
export interface DepsObject {
    /**
     * The internationalization object.
     */
    readonly i18n: i18n;

    /**
     * Whether the user is signed in.
     */
    readonly isUserLoggedIn: boolean;

    /**
     * The currently active time zone 
     */
    readonly timeZone: string;
}

/**
 * Options for the `makeDeps` function.
 */
export interface MakeDepsOptions {
    /**
     * The request the dependencies are being created for.
     */
    readonly req: Request<any, any, any, any, any>;

    /**
     * The location the request was made for.
     */
    readonly location?: LocationCoordinates;
}

/**
 * Create a dependencies object for a view template.
 */
export async function makeDeps({ req, location }: MakeDepsOptions): Promise<DepsObject> {
    return {
        i18n: req.i18n,
        isUserLoggedIn: (req.userAccount !== undefined),
        timeZone: mapIfNotUndefined(location, timezoneFor) ?? "UTC",
    };
}

/**
 * Dependencies made available to components in this app.
 */
const Deps = createContext<DepsObject | undefined>(undefined);

/**
 * Props for a `DepsProvider` component.
 */
export interface DepsProviderProps {
    readonly deps: DepsObject;
    readonly children: ComponentChildren;
}

/**
 * Component which makes dependencies available to child components.
 */
export function DepsProvider({ deps, children }: DepsProviderProps) {
    return (
        <Deps.Provider value={deps}>
            {children}
        </Deps.Provider>
    );
}

/**
 * Hook to access the dependencies made available to components.
 */
export function useDeps(): DepsObject {
    const deps = useContext(Deps);
    if (deps === undefined) {
        throw new Error("useDeps() used outside of <DepsProvider>");
    }
    return deps;
}
