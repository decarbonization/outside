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

import classNames from "classnames";
import { i18n } from "i18next";
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";

export interface DateProps {
    /**
     * Extra class names to apply to the element.
     */
    readonly className?: string;

    /**
     * The instant in time to render.
     */
    readonly when?: Date;

    /**
     * Whether to hide the element if `when` is not provided.
     */
    readonly autoHide?: boolean;
}

/**
 * Convert a date into a localized, human-readable string.
 * 
 * @param i18n The i18next object to use when formatting the date.
 * @param when The date to format.
 * @param options Options specifying how to format the date.
 * @returns A human readable, localized string representation of the date.
 */
export function formatDate(
    i18n: i18n, 
    when: Date, 
    options: Intl.DateTimeFormatOptions
): string {
    return i18n.format(when, "datetime", undefined, {
        interpolation: { escapeValue: false },
        ...options,
    });
}

function Empty({ className, autoHide = false }: DateProps) {
    if (autoHide) {
        return null;
    } else {
        const { i18n } = useContext(Deps);
        return (
            <span className={classNames("datetime", "empty", className)}>
                {i18n.t("units:placeholder")}
            </span>
        );
    }
}

export function Hour({ className, when, autoHide }: DateProps) {
    if (when === undefined) {
        return <Empty className={className} autoHide={autoHide} />
    }
    const { i18n, timeZone } = useContext(Deps);
    return (
        <span className={classNames("datetime", className)}>
            {formatDate(i18n, when, { hour: 'numeric', timeZone })}
        </span>
    );
}

export function ShortDate({ className, when, autoHide }: DateProps) {
    if (when === undefined) {
        return <Empty className={className} autoHide={autoHide} />
    }
    const { i18n, timeZone } = useContext(Deps);
    return (
        <span className={classNames("datetime", className)}>
            {formatDate(i18n, when, { dateStyle: 'short', timeZone })}
        </span>
    );
}

export function ShortTime({ className, when, autoHide }: DateProps) {
    if (when === undefined) {
        return <Empty className={className} autoHide={autoHide} />
    }
    const { i18n, timeZone } = useContext(Deps);
    return (
        <span className={classNames("datetime", className)}>
            {formatDate(i18n, when, { timeStyle: 'short', timeZone })}
        </span>
    );
}

export function Weekday({ className, when, autoHide }: DateProps) {
    if (when === undefined) {
        return <Empty className={className} autoHide={autoHide} />
    }
    const { i18n, timeZone } = useContext(Deps);
    return (
        <span className={classNames("datetime", className)}>
            {formatDate(i18n, when, { weekday: 'short', timeZone })}
        </span>
    );
}
