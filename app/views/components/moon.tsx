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

import { t } from "i18next";
import { MoonPhase } from "../../../fruit-company/weather/models/base";

const phaseClassNames = {
    [MoonPhase.new]: "wi-moon-new",
    [MoonPhase.waxingCrescent]: "wi-moon-waxing-crescent-2",
    [MoonPhase.firstQuarter]: "wi-moon-first-quarter",
    [MoonPhase.full]: "wi-moon-full",
    [MoonPhase.waxingGibbous]: "wi-moon-waxing-gibbous-2",
    [MoonPhase.waningGibbous]: "wi-moon-waning-gibbous-2",
    [MoonPhase.thirdQuarter]: "wi-moon-third-quarter",
    [MoonPhase.waningCrescent]: "wi-moon-waning-crescent-2",
};

export interface MoonProps {
    readonly className?: string;
    readonly phase: MoonPhase;
    readonly labeled?: boolean;
}

export function Moon({className, phase, labeled}: MoonProps) {
    return (
        <>
            <span className={`${className ?? ''} wi ${phaseClassNames[phase]}`} alt={t(`forecast.moonPhase.${phase}`, { defaultValue: String(phase) })} />
            {labeled === true ? ` ${t(`forecast.moonPhase.${phase}`, { defaultValue: String(phase) })}` : ""}
        </>
    );
}
