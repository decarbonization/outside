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
import { t } from "i18next";
import { MoonPhase } from "../../../fruit-company/weather/models/base";

const phaseImageNames = {
    [MoonPhase.new]: "moon-new",
    [MoonPhase.waxingCrescent]: "moon-waxing-crescent",
    [MoonPhase.firstQuarter]: "moon-first-quarter",
    [MoonPhase.full]: "moon-full",
    [MoonPhase.waxingGibbous]: "woon-waxing-gibbous",
    [MoonPhase.waningGibbous]: "moon-waning-gibbous",
    [MoonPhase.thirdQuarter]: "moon-last-quarter",
    [MoonPhase.waningCrescent]: "moon-waning-crescent",
};

export interface MoonProps {
    readonly className?: string;
    readonly phase: MoonPhase;
}

export function Moon({className, phase}: MoonProps) {
    return (
        <img className={classNames("moon-phase", className)} src={srcFor(phase)} alt={labelFor(phase)} />
    );
}

function srcFor(phase: MoonPhase): string {
    const imageName = phaseImageNames[phase];
    return `/weather-icons/fill/${imageName}.svg`;
}

function labelFor(phase: MoonPhase): string {
    return t(`forecast.moonPhase.${phase}`, { defaultValue: String(phase) });
}
