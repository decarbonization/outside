/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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

import { parseWeather, Weather } from "fruit-company/weather";
import { CurrentAirConditions, parseCurrentAirConditions } from "good-breathing/aqi";
import {
    ChangeAccountRequestBody,
    ChangeAccountResponseBody,
    ErrorResponseBody,
    ForgotPasswordRequestBody,
    ForgotPasswordResponseBody,
    ForgotPaswordRecoverRequestBody,
    ForgotPaswordRecoverResponseBody,
    GetAccountResponseBody,
    SignInRequestBody,
    SignInResponseBody,
    SignUpRequestBody,
    SignUpResponseBody,
    SignUpVerifyRequestBody,
    SignUpVerifyResponseBody,
} from "./types";

async function GET<ResBody>(
    route: string,
): Promise<ResBody> {
    const response = await fetch(route, {
        credentials: "same-origin",
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });
    if (!response.ok) {
        try {
            const errorResponse = await response.json() as ErrorResponseBody;
            throw new Error(`${route}: ${errorResponse.message}`);
        } catch {
            throw new Error(`${route}: Unknown Error`);
        }
    }
    return await response.json() as ResBody;
}

async function POST<ReqBody, ResBody>(
    route: string,
    body: ReqBody
): Promise<ResBody> {
    const response = await fetch(route, {
        credentials: "same-origin",
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        try {
            const errorResponse = await response.json() as ErrorResponseBody;
            throw new Error(`${route}: ${errorResponse.message}`);
        } catch {
            throw new Error(`${route}: Unknown Error`);
        }
    }
    return await response.json() as ResBody;
}

export async function signIn(body: SignInRequestBody): Promise<SignInResponseBody> {
    return await POST('/api/sign-in', body);
}

export async function signOut(): Promise<void> {
    return await POST('/api/sign-out', undefined);
}

export async function signUp(body: SignUpRequestBody): Promise<SignUpResponseBody> {
    return await POST('/api/sign-up', body);
}

export async function signUpVerify(body: SignUpVerifyRequestBody): Promise<SignUpVerifyResponseBody> {
    return await POST('/api/sign-up/verify', body);
}

export async function forgotPassword(body: ForgotPasswordRequestBody): Promise<ForgotPasswordResponseBody> {
    return await POST('/api/forgot-password', body);
}

export async function forgotPasswordRecover(body: ForgotPaswordRecoverRequestBody): Promise<ForgotPaswordRecoverResponseBody> {
    return await POST('/api/forgot-password/recover', body);
}

export async function getAccount(): Promise<GetAccountResponseBody> {
    return await GET('/api/account');
}

export async function changeAccount(body: ChangeAccountRequestBody): Promise<ChangeAccountResponseBody> {
    return await POST('/api/account', body);
}

export async function getWeather(
    country: string, 
    latitude: string, 
    longitude: string
): Promise<Weather> {
    const route = `/api/weather/${country}/${latitude}/${longitude}`;
    const response = await fetch(route, {
        credentials: "same-origin",
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });
    if (!response.ok) {
        try {
            const errorResponse = await response.json() as ErrorResponseBody;
            throw new Error(`${route}: ${errorResponse.message}`);
        } catch {
            throw new Error(`${route}: Unknown Error`);
        }
    }
    return parseWeather(await response.text());
}

export async function getCurrentAirConditions(
    country: string, 
    latitude: string, 
    longitude: string
): Promise<CurrentAirConditions> {
    const route = `/api/air/${country}/${latitude}/${longitude}`;
    const response = await fetch(route, {
        credentials: "same-origin",
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });
    if (!response.ok) {
        try {
            const errorResponse = await response.json() as ErrorResponseBody;
            throw new Error(`${route}: ${errorResponse.message}`);
        } catch {
            throw new Error(`${route}: Unknown Error`);
        }
    }
    return parseCurrentAirConditions(await response.text());
}
