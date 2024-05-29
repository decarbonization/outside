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
            {i18n.format(when, "datetime", undefined, { hour: 'numeric', timeZone })}
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
            {i18n.format(when, "datetime", undefined, { dateStyle: 'short', timeZone })}
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
            {i18n.format(when, "datetime", undefined, { timeStyle: 'short', timeZone })}
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
            {i18n.format(when, "datetime", undefined, { weekday: 'short', timeZone })}
        </span>
    );
}
