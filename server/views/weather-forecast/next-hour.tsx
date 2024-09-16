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

import { differenceInMinutes } from "date-fns";
import { ForecastPeriodSummary, NextHourForecast, PrecipitationType } from "fruit-company/weather";
import { i18n } from "i18next";
import { useContext } from "preact/hooks";
import { chanceFragment, precipitationIntensityFragment, precipitationTypeFragment } from "../../formatting/fragments";
import { Deps } from "../_deps";
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
    const { i18n } = useContext(Deps);
    const summary = summaryText(i18n, forecast.summary);
    return (
        <section className="next-hour-forecast">
            {summary !== undefined
                ? <p className="summary">{summary}</p>
                : null}
            <PrecipitationChart samples={forecast.minutes} />
        </section>
    );
}

function summaryText(i18n: i18n, summary: ForecastPeriodSummary[]): string | undefined {
    const stormyPeriods = summary.filter(p => p.condition !== PrecipitationType.clear);
    if (stormyPeriods.length === 0) {
        return undefined;
    }

    const summaryPeriods = stormyPeriods.map(period => {
        if (period.endTime !== undefined) {
            return i18n.t('nextHourForecast.periodDefinite', {
                interpolation: { escapeValue: false },
                chance: chanceFragment(period.precipitationChance, { i18n }),
                intensity: precipitationIntensityFragment(period.precipitationIntensity, { i18n, lowercase: true }),
                type: precipitationTypeFragment(period.condition, { i18n, lowercase: true }),
                duration: differenceInMinutes(period.endTime, period.startTime),
            });
        } else {
            return i18n.t('nextHourForecast.periodIndefinite', {
                interpolation: { escapeValue: false },
                chance: chanceFragment(period.precipitationChance, { i18n }),
                intensity: precipitationIntensityFragment(period.precipitationIntensity, { i18n, lowercase: true }),
                type: precipitationTypeFragment(period.condition, { i18n, lowercase: true }),
            });
        }
    });
    return summaryPeriods.join(i18n.t('nextHourForecast.periodJoiner'));
}