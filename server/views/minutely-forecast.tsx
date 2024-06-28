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
    const { i18n } = useContext(Deps);
    return (
        <section className="minutely-forecast">
            <p className="summary">
                {summaryText(i18n, forecast.summary)}
            </p>
            {
                hasPrecipitation(forecast.minutes)
                    ? <BarChart className="minutely-forecast-minutes" min={0} max={1} values={forecast.minutes.map(m => m.precipitationChance)} />
                    : null
            }
        </section>
    );
}

function summaryText(i18n: i18n, summary: ForecastPeriodSummary[]): string {
    if (summary.length === 1) {
        const onlyPeriod = summary[0];
        if (onlyPeriod.condition === PrecipitationType.clear) {
            return i18n.t('minutelyForecast.periodClearFullHour');
        } else {
            return i18n.t('minutelyForecast.periodFullHour', {
                chance: onlyPeriod.precipitationChance,
                type: nameOf(i18n, onlyPeriod.condition),
            });
        }
    } else {
        const summaryPeriods = summary.map(period => {
            if (period.endTime !== undefined) {
                return i18n.t('minutelyForecast.periodDefinite', {
                    chance: period.precipitationChance,
                    type: nameOf(i18n, period.condition),
                    start: period.startTime,
                    end: period.endTime,
                });
            } else {
                return i18n.t('minutelyForecast.periodIndefinite', {
                    chance: period.precipitationChance,
                    type: nameOf(i18n, period.condition),
                    start: period.startTime,
                });
            }
        });
        return summaryPeriods.join(i18n.t('miuntelyForecast.periodJoiner'));
    }
}

function nameOf(i18n: i18n, condition: PrecipitationType): string {
    return i18n.t(`forecast.precipitationType.${condition}`, { defaultValue: condition });
}

function hasPrecipitation(minutes: ForecastMinute[]): boolean {
    return minutes.some(m => m.precipitationChance > 0);
}
