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
import { envInt } from "../utilities/env";
import { mapIfNotUndefined } from "../utilities/maybe";

export type LinkDestination =
    | { where: "index", query?: string }
    | { where: "signIn", returnTo?: string }
    | { where: "signOut", returnTo?: string }
    | { where: "signUp", returnTo?: string }
    | { where: "signUpVerify", token: string, returnTo?: string }
    | { where: "forgotPassword", email?: string }
    | { where: "accountSettings" }
    | { where: "searchByQuery", query?: string }
    | { where: "searchByCoordinates", location: LocationCoordinates }
    | { where: "weather", countryCode: string, location: LocationCoordinates, query: string, ref?: string };
export type LinkDestinationTo<Where extends LinkDestination["where"]> = Extract<LinkDestination, { where: Where }>;

export function linkDestination<Where extends LinkDestination["where"]>(destination: LinkDestinationTo<Where>): LinkDestinationTo<Where> {
    return destination;
}

export function fullyQualifiedLinkTo(destination: LinkDestination): string {
    const base = mapIfNotUndefined(process.env["HOST"], host => `https://${host}`)
        ?? `http://localhost:${envInt("PORT", 8000)}`;
    const link = linkTo(destination);
    return `${base}${link}`;
}

export function linkTo(destination: LinkDestination): string {
    switch (destination.where) {
        case "index":
            return linkToIndex(destination);
        case "signIn":
            return linkToSignIn(destination);
        case "signOut":
            return linkToSignOut(destination);
        case "signUp":
            return linkToSignUp(destination);
        case "signUpVerify":
            return linkToSignUpVerify(destination);
        case "accountSettings":
            return linkToAccountSettings(destination);
        case "forgotPassword":
            return linkToForgotPassword(destination);
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

function linkToSignIn({ returnTo }: LinkDestinationTo<"signIn">): string {
    let link = "/sign-in";
    if (returnTo !== undefined) {
        link += `?returnto=${encodeURIComponent(returnTo)}`
    }
    return link;
}

function linkToSignOut({ returnTo }: LinkDestinationTo<"signOut">): string {
    let link = `/sign-out`;
    if (returnTo !== undefined) {
        link += `?returnto=${encodeURIComponent(returnTo)}`
    }
    return link;
}

function linkToSignUp({ returnTo }: LinkDestinationTo<"signUp">): string {
    let link = "/sign-up";
    if (returnTo !== undefined) {
        link += `?returnto=${encodeURIComponent(returnTo)}`
    }
    return link;
}

function linkToSignUpVerify({ token, returnTo }: LinkDestinationTo<"signUpVerify">): string {
    let link = `/sign-up/verify?token=${encodeURIComponent(token)}`;
    if (returnTo !== undefined) {
        link += `&returnto=${encodeURIComponent(returnTo)}`;
    }
    return link;
}

function linkToForgotPassword({ email }: LinkDestinationTo<"forgotPassword">): string {
    let link = '/forgot-password';
    if (email !== undefined) {
        link += `?email=${encodeURIComponent(email)}`;
    }
    return link;
}

function linkToAccountSettings({ }: LinkDestinationTo<"accountSettings">): string {
    return "/account";
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

function linkToWeather({ countryCode, location, query, ref }: LinkDestinationTo<"weather">): string {
    const { latitude, longitude } = location.truncatedTo(3);
    let link = `/weather/${encodeURIComponent(countryCode)}/${latitude}/${longitude}/${encodeURIComponent(query)}`;
    if (ref !== undefined) {
        link += `?ref=${encodeURIComponent(ref)}`;
    }
    return link;
}
