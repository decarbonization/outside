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

import { LocationCoordinates, truncateLocationCoordinates } from "serene-front/models";

export type WeatherSubdestination =
    | "astronomy"
    | "air";

export type LinkDestination =
    | { where: "index", query?: string }
    | { where: "searchByQuery", query?: string }
    | { where: "searchByCoordinates", location: LocationCoordinates }
    | { where: "weather", sub?: WeatherSubdestination, countryCode: string, location: LocationCoordinates, query: string, ref?: string };
export type ExactLinkDestination<Where extends LinkDestination["where"]> = Extract<LinkDestination, { where: Where }>;

export function linkTo(destination: LinkDestination): string {
    switch (destination.where) {
        case "index":
            return linkToIndex(destination);
        case "searchByQuery":
            return linkToSearchByQuery(destination);
        case "searchByCoordinates":
            return linkToSearchByCoordinates(destination);
        case "weather":
            return linkToWeather(destination);
    }
}

function linkToIndex({ query }: ExactLinkDestination<"index">): string {
    let link = "/";
    if (query !== undefined) {
        link += `?q=${encodeURIComponent(query)}`;
    }
    return link;
}

function linkToSearchByQuery({ query }: ExactLinkDestination<"searchByQuery">): string {
    let link = "/search";
    if (query !== undefined) {
        link += `?q=${encodeURIComponent(query)}`;
    }
    return link;
}

function linkToSearchByCoordinates({ location: { latitude, longitude } }: ExactLinkDestination<"searchByCoordinates">): string {
    return `/search/${latitude}/${longitude}`;
}

function linkToWeather({ countryCode, sub, location, query, ref }: ExactLinkDestination<"weather">): string {
    const { latitude, longitude } = truncateLocationCoordinates(location, 3);
    let link = `/weather/${encodeURIComponent(countryCode)}/${latitude}/${longitude}/${encodeURIComponent(query)}`;
    if (sub !== undefined) {
        link += `/${sub}`;
    }
    if (ref !== undefined) {
        link += `?ref=${encodeURIComponent(ref)}`;
    }
    return link;
}
