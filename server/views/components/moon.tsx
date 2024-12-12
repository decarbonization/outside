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
import { MoonPhase } from "fruit-company/weather";
import { moonPhaseFragment } from "../../formatting/fragments";
import { icon, IconPack } from "../../styling/icon-pack";
import { useDeps } from "../_deps";

const moonIcons: IconPack<MoonPhase> = {
    "base": {
        "day": "wi fill day",
        "night": "wi fill night"
    },
    "new": "moon-new",
    "waxingCrescent": "moon-waxing-crescent",
    "firstQuarter": "moon-first-quarter",
    "full": "moon-full",
    "waxingGibbous": "moon-waxing-gibbous",
    "waningGibbous": "moon-waning-gibbous",
    "thirdQuarter": "moon-last-quarter",
    "waningCrescent": "moon-waning-crescent",
};

export interface MoonProps {
    readonly className?: string;
    readonly phase: MoonPhase;
}

export function Moon({ className, phase }: MoonProps) {
    const { i18n } = useDeps();
    return (
        <span className={classNames("icon", "moon", className, icon(moonIcons, { name: phase, daylight: false }))} aria-label={moonPhaseFragment(phase, { i18n })} />
    );
}
