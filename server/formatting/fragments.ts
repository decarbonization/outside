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

import { MoonPhase, precipitationIntensityFrom, PrecipitationType, probabilityChanceFrom, WeatherCondition } from "fruit-company/weather";
import { i18n } from "i18next";

export interface FragmentOptions {
    readonly i18n: i18n;
    readonly lowercase?: boolean;
}

function process(
    fragment: string,
    { i18n, lowercase = false }: FragmentOptions
) {
    if (lowercase) {
        const locale = i18n.resolvedLanguage ?? i18n.language;
        return fragment.toLocaleLowerCase(locale);
    } else {
        return fragment;
    }
}

export function weatherConditionFragment(
    code: WeatherCondition,
    { i18n, lowercase }: FragmentOptions
): string {
    return process(i18n.t(`forecast.weatherCondition.${code}`, {
        defaultValue: code as string,
    }), {
        i18n,
        lowercase,
    });
}

export function moonPhaseFragment(
    phase: MoonPhase,
    { i18n, lowercase }: FragmentOptions
): string {
    return process(i18n.t(`forecast.moonPhase.${phase}`, {
        defaultValue: phase as string,
    }), {
        i18n,
        lowercase,
    });
}


export function precipitationTypeFragment(
    condition: PrecipitationType,
    { i18n, lowercase }: FragmentOptions
): string {
    return process(i18n.t(`forecast.precipitationType.${condition}`, {
        defaultValue: condition,
    }), {
        i18n,
        lowercase,
    });
}

export function chanceFragment(
    p: number,
    { i18n, lowercase }: FragmentOptions
): string {
    const chance = probabilityChanceFrom(p);
    return process(i18n.t(`forecast.chance.${chance}`, {
        defaultValue: chance,
    }), {
        i18n,
        lowercase,
    });
}

export function precipitationIntensityFragment(
    precipitationIntensity: number,
    { i18n, lowercase }: FragmentOptions
): string {
    const intensity = precipitationIntensityFrom(precipitationIntensity);
    return process(i18n.t(`forecast.intensity.${intensity}`, {
        defaultValue: intensity,
    }), {
        i18n,
        lowercase,
    });
}