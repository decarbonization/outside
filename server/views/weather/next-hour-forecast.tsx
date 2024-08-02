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

import { ForecastMinute, ForecastPeriodSummary, NextHourForecast, precipitationIntensityFrom, PrecipitationType, probabilityChanceFrom } from "fruit-company/weather";
import { i18n } from "i18next";
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";
import { formatDate } from "../components/dates";
import { PrecipitationChart } from "../components/precipitation-chart";

export interface NextHourForecastProps {
    readonly forecast?: NextHourForecast;
}

export function NextHourForecast({ forecast }: NextHourForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    if (forecast.summary.length === 0) {
        return null;
    }
    const { i18n, timeZone } = useContext(Deps);
    return (
        <section className="next-hour-forecast">
            <p className="summary">
                {summaryText(i18n, forecast.summary)}
            </p>
            <PrecipitationChart samples={forecast.minutes} />
        </section>
    );
}

function summaryText(i18n: i18n, summary: ForecastPeriodSummary[]): string {
    const stormyPeriods = summary.filter(p => p.condition !== PrecipitationType.clear);
    if (stormyPeriods.length === 0) {
        return i18n.t('nextHourForecast.periodClearFullHour');
    }

    const summaryPeriods = summary.map(period => {
        if (period.endTime !== undefined) {
            return i18n.t('nextHourForecast.periodDefinite', {
                interpolation: { escapeValue: false },
                chance: chanceOf(i18n, period.precipitationChance),
                intensity: intensityOf(i18n, period.precipitationIntensity),
                type: nameOf(i18n, period.condition),
                start: period.startTime,
                end: period.endTime,
            });
        } else {
            return i18n.t('nextHourForecast.periodIndefinite', {
                interpolation: { escapeValue: false },
                chance: chanceOf(i18n, period.precipitationChance),
                intensity: intensityOf(i18n, period.precipitationIntensity),
                type: nameOf(i18n, period.condition),
                start: period.startTime,
            });
        }
    });
    return summaryPeriods.join(i18n.t('nextHourForecast.periodJoiner'));
}

function nameOf(i18n: i18n, condition: PrecipitationType): string {
    return i18n.t(`forecast.precipitationType.${condition}`, { defaultValue: condition });
}

function chanceOf(i18n: i18n, p: number): string {
    const chance = probabilityChanceFrom(p);
    return i18n.t(`forecast.chance.${chance}`);
}

function intensityOf(i18n: i18n, precipitationIntensity: number): string {
    const intensity = precipitationIntensityFrom(precipitationIntensity);
    return i18n.t(`forecast.intensity.${intensity}`);
}

function hasPrecipitation(minutes: ForecastMinute[]): boolean {
    return minutes.some(m => m.precipitationChance > 0);
}
