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

import { ForecastMinute, ForecastPeriodSummary, NextHourForecast, PrecipitationType } from "fruit-company";
import { i18n } from "i18next";
import { useContext } from "preact/hooks";
import { Deps } from "./_deps";
import classNames from "classnames";
import { BarChart } from "./components/bar-chart";
import { formatDate } from "./components/dates";

export interface MinutelyForecastProps {
    readonly forecast?: NextHourForecast;
}

export function MinutelyForecast({ forecast }: MinutelyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    if (forecast.summary.length === 0) {
        return null;
    }
    const { i18n, timeZone } = useContext(Deps);
    const points = forecast.minutes.map(m => ({
        value: m.precipitationChance,
        caption: formatDate(i18n, m.startTime, { timeStyle: 'short', timeZone }),
    }));
    return (
        <section className="minutely-forecast">
            <p className="summary">
                {summaryText(i18n, forecast.summary)}
            </p>
            {
                hasPrecipitation(forecast.minutes)
                    ? <BarChart className="minutely-forecast-minutes" min={0} max={1} points={points} />
                    : null
            }
        </section>
    );
}

function summaryText(i18n: i18n, summary: ForecastPeriodSummary[]): string {
    const stormyPeriods = summary.filter(period => period.condition !== PrecipitationType.clear && period.precipitationChance > 0);
    if (stormyPeriods.length === 0) {
        return i18n.t('minutelyForecast.periodClearFullHour');
    } else if (summary.length === 1) {
        const onlyPeriod = summary[0];
        return i18n.t('minutelyForecast.periodFullHour', {
            interpolation: { escapeValue: false },
            chance: onlyPeriod.precipitationChance,
            intensity: intensityOf(i18n, onlyPeriod.precipitationIntensity),
            type: nameOf(i18n, onlyPeriod.condition),
        });
    } else {
        const summaryPeriods = summary.map(period => {
            if (period.endTime !== undefined) {
                return i18n.t('minutelyForecast.periodDefinite', {
                    interpolation: { escapeValue: false },
                    chance: period.precipitationChance,
                    intensity: intensityOf(i18n, period.precipitationIntensity),
                    type: nameOf(i18n, period.condition),
                    start: period.startTime,
                    end: period.endTime,
                });
            } else {
                return i18n.t('minutelyForecast.periodIndefinite', {
                    interpolation: { escapeValue: false },
                    chance: period.precipitationChance,
                    intensity: intensityOf(i18n, period.precipitationIntensity),
                    type: nameOf(i18n, period.condition),
                    start: period.startTime,
                });
            }
        });
        return summaryPeriods.join(i18n.t('minutelyForecast.periodJoiner'));
    }
}

function nameOf(i18n: i18n, condition: PrecipitationType): string {
    return i18n.t(`forecast.precipitationType.${condition}`, { defaultValue: condition });
}

function intensityOf(i18n: i18n, precipitationIntensity: number): string {
    if (precipitationIntensity <= 0.0) {
        throw new RangeError(`<${precipitationIntensity}> is not a valid precipitation intensity`);
    } else if (precipitationIntensity <= 2.5) {
        return i18n.t("minutelyForecast.precipitationIntensity.light");
    } else if (precipitationIntensity <= 7.5) {
        return i18n.t("minutelyForecast.precipitationIntensity.moderate");
    } else if (precipitationIntensity <= 50) {
        return i18n.t("minutelyForecast.precipitationIntensity.heavy");
    } else {
        return i18n.t("minutelyForecast.precipitationIntensity.violent");
    }
}

function hasPrecipitation(minutes: ForecastMinute[]): boolean {
    return minutes.some(m => m.precipitationChance > 0);
}
