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

export interface ErrorResponseBody {
    readonly message: string;
}


// POST /api/sign-in

export interface SignInRequestBody {
    readonly email: string;
    readonly password: string;
}

export interface SignInResponseBody {
    readonly id: string;
}


// POST /api/sign-up

export interface SignUpRequestBody {
    readonly email: string;
    readonly password: string
    readonly confirm_password: string;
}

export interface SignUpResponseBody {
    readonly id: string;
}


// POST /api/sign-up/verify

export interface SignUpVerifyRequestBody {
    readonly token: string;
}

export interface SignUpVerifyResponseBody {
    readonly id: string;
}


// POST /api/forgot-password

export interface ForgotPasswordRequestBody {
    readonly email: string;
}

export interface ForgotPasswordResponseBody {
    readonly email: string;
}


// POST /api/forgot-password/recover

export interface ForgotPaswordRecoverRequestBody {
    readonly password: string;
    readonly confirm_password: string;
}

export interface ForgotPaswordRecoverResponseBody {
    readonly id: string;
}


// GET /api/account

export interface GetAccountResponseBody {
    readonly id: number;
    readonly email: string;
}

// POST /api/account

export interface ChangeAccountRequestBody {
    readonly oldPassword?: string;
    readonly newPasword?: string;
    readonly confirmNewPassword?: string;
}

export interface ChangeAccountResponseBody {
    readonly id: string;
    readonly changes: ('password')[];
}
