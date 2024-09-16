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

import { LocationCoordinates } from "serene-front/data";

export type WeatherTab =
    | "forecast"
    | "astronomy"
    | "air";

export type LinkDestination =
    | { where: "index", query?: string }
    | { where: "login" }
    | { where: "loginVerify", otp: string, returnTo?: string }
    | { where: "searchByQuery", query?: string }
    | { where: "searchByCoordinates", location: LocationCoordinates }
    | { where: "weather", tab: WeatherTab, countryCode: string, location: LocationCoordinates, query: string, ref?: string };
export type LinkDestinationTo<Where extends LinkDestination["where"]> = Extract<LinkDestination, { where: Where }>;

export function linkDestination<Where extends LinkDestination["where"]>(destination: LinkDestinationTo<Where>): LinkDestinationTo<Where> {
    return destination;
}

export function linkTo(destination: LinkDestination): string {
    switch (destination.where) {
        case "index":
            return linkToIndex(destination);
        case "login":
            return linkToUserSession(destination);
        case "loginVerify":
            return linkToUserSessionVerify(destination);
        case "searchByQuery":
            return linkToSearchByQuery(destination);
        case "searchByCoordinates":
            return linkToSearchByCoordinates(destination);
        case "weather":
            return linkToWeather(destination);
    }
}

function linkToIndex({ query }: LinkDestinationTo<"index">): string {
    let link = "/";
    if (query !== undefined) {
        link += `?q=${encodeURIComponent(query)}`;
    }
    return link;
}

function linkToUserSession({ }: LinkDestinationTo<"login">): string {
    return "/login";
}

function linkToUserSessionVerify({ otp, returnTo }: LinkDestinationTo<"loginVerify">): string {
    let link = `/login/verify/${encodeURIComponent(otp)}`;
    if (returnTo !== undefined) {
        link += `?returnto=${encodeURIComponent(returnTo)}`
    }
    return link;
}

function linkToSearchByQuery({ query }: LinkDestinationTo<"searchByQuery">): string {
    let link = "/search";
    if (query !== undefined) {
        link += `?q=${encodeURIComponent(query)}`;
    }
    return link;
}

function linkToSearchByCoordinates({ location: { latitude, longitude } }: LinkDestinationTo<"searchByCoordinates">): string {
    return `/search/${latitude}/${longitude}`;
}

function linkToWeather({ countryCode, tab, location, query, ref }: LinkDestinationTo<"weather">): string {
    const { latitude, longitude } = location.truncatedTo(3);
    let link = `/weather/${encodeURIComponent(countryCode)}/${latitude}/${longitude}/${encodeURIComponent(query)}`;
    if (tab !== 'forecast') {
        link += `/${tab}`;
    }
    if (ref !== undefined) {
        link += `?ref=${encodeURIComponent(ref)}`;
    }
    return link;
}
