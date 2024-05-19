/*
 * outside weather app
 * Copyright (C) 2014  Peter "Kevin" Contreras
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
import { WeatherCondition } from "../../../fruit-company/weather/models/base";
import { resolve } from "../../styling/dynamic-class-name";
import { Theme } from "../../styling/themes";
import { Deps } from "../_deps";

export interface ConditionProps {
    readonly className?: string;
    readonly code: WeatherCondition;
    readonly daylight?: boolean;
}

export function Condition({ className, code, daylight = true }: ConditionProps) {
    const { i18n, theme } = useContext(Deps);
    return (
        <span className={classNames(className, classNameFor(theme, code, daylight))} alt={labelFor(i18n, code)} />
    );
}

function classNameFor(theme: Theme, code: WeatherCondition, daylight: boolean): string | undefined {
    const className = theme.icons[code];
    if (className === undefined) {
        return undefined;
    }
    if (daylight) {
        return resolve(className, { dayNight: "day" });
    } else {
        return resolve(className, { dayNight: "night" });
    }
}

function labelFor(i18n: i18n, code: WeatherCondition): string {
    return i18n.t(`forecast.weatherCondition.${code}`, { defaultValue: code as string });
}
