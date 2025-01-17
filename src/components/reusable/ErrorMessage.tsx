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

import { i18n } from "i18next";
// TODO: import { UserSystemError } from "../../accounts/errors";
import { useDeps } from "../../hooks/Deps";

export interface ErrorMessageProps {
    readonly error?: unknown
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
    if (error === undefined || error === null) {
        return null;
    }

    const { i18n } = useDeps();
    const message = messageFrom(i18n, error);
    return (
        <p className="message">
            {message}
        </p>
    );
}

function messageFrom(i18n: i18n, error: unknown) {
    /*if (error instanceof UserSystemError) {
        return i18n.t(`accounts.errors.${error.code}`)
    } else */if (error instanceof Error) {
        return error.message;
    } else {
        return `${error}`;
    }
}
