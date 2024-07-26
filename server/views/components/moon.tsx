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
import { MoonPhase } from "fruit-company";
import { i18n } from "i18next";
import { useContext } from "preact/hooks";
import { themeIcon } from "../../styling/themes";
import { Deps } from "../_deps";

export interface MoonProps {
    readonly className?: string;
    readonly phase: MoonPhase;
}

export function Moon({ className, phase }: MoonProps) {
    const { i18n, theme } = useContext(Deps);
    return (
        <span className={classNames("icon", "moon", className, themeIcon(theme, { name: phase, daylight: false }))} aria-label={labelFor(i18n, phase)} />
    );
}

function labelFor(i18n: i18n, phase: MoonPhase): string {
    return i18n.t(`forecast.moonPhase.${phase}`, { defaultValue: String(phase) });
}
