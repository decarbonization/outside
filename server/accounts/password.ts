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

const passwordSymbols = /[!@#$%^&*'()[\]\-_:]/;
const passwordUppercaseLetters = /[A-Z]/;
const passwordLowercaseLetters = /[a-z]/;
const passwordNumbers = /[0-9]/;
const tokenSymbols = /[0-9]|[a-f]]/;

export type ValidPassword = string & { readonly _ValidPassword: unique symbol };

export type ValidToken = string & { readonly _ValidToken: unique symbol };


export function isValidPassword(password: string): password is ValidPassword {
    if (password.length < 8) {
        return false;
    }
    if (password.length > 64) {
        return false;
    }
    if (!passwordSymbols.test(password)) {
        return false;
    }
    if (!passwordUppercaseLetters.test(password)) {
        return false;
    }
    if (!passwordLowercaseLetters.test(password)) {
        return false;
    }
    if (!passwordNumbers.test(password)) {
        return false;
    }
    return true;
}

export function isValidToken(token: string): token is ValidToken {
    if (token.length !== 128) {
        return false;
    }
    if (!tokenSymbols.test(token)) {
        return false;
    }
    return true;
}

export type HashedPassword = string & { readonly _HashedPassword: unique symbol };

export async function hashPassword(password: ValidPassword, salt: string): Promise<HashedPassword> {
    if (salt.length === 0) {
        throw new RangeError("salt cannot be empty");
    }
    const passwordBytes = new TextEncoder().encode(password + salt);
    const digest = await crypto.subtle.digest("SHA-512", passwordBytes);
    const digestBytes = new Uint8Array(digest);
    const hashedPassword = bytesToString(digestBytes);
    return hashedPassword as unknown as HashedPassword;
}

export async function token(): Promise<ValidToken> {
    const bytes = new Uint8Array(64);
    crypto.getRandomValues(bytes);
    const token = bytesToString(bytes);
    return token as unknown as ValidToken;
}

export async function checkPassword(
    userPassword: HashedPassword, 
    submittedPassword: ValidPassword, 
    salts: string[],
): Promise<boolean> {
    if (salts.length === 0) {
        throw new RangeError("salts cannot be empty");
    }
    for (const salt of salts) {
        const candidate = await hashPassword(submittedPassword, salt);
        if ((userPassword as string) === (candidate as string)) {
            return true;
        }
    }
    return false;
}

function bytesToString(bytes: Uint8Array): string {
    let value = '';
    for (const byte of bytes) {
        value += `00${byte.toString(16)}`.slice(-2);
    }
    return value;
}
