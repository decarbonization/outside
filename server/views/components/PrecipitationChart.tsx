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
import { differenceInMinutes } from "date-fns";
import { ForecastMinute, precipitationIntensityFrom } from "fruit-company/weather";
import { i18n } from "i18next";
import { percentage } from "../../styling/transforms";
import { segmentBy } from "../../utilities/array-utils";
import { useDeps } from "../_deps";

export interface PrecipitationChartProps {
    readonly className?: string;
    readonly samples: ForecastMinute[];
    readonly groupSize?: number;
    readonly maxGroups?: number;
}

export default function PrecipitationChart({
    className,
    samples,
    groupSize = 10,
    maxGroups = 6,
}: PrecipitationChartProps) {
    if (!samples.some(m => m.precipitationChance > 0)) {
        return null;
    }
    const { i18n } = useDeps();
    const startTime = samples[0].startTime;
    const segments = segmentBy(samples, groupSize).slice(0, maxGroups);
    return (
        <div className={classNames("precipitation-chart", "h-flow", className)}>
            <footer className="y-label">
                {i18n.t('nextHourForecast.yLabel')}
            </footer>
            {segments.map(segment => (
                <section>
                    <div className="group">
                        {segment.map(minute => (
                            <div
                                className={classNames("minute", precipitationIntensityFrom(minute.precipitationIntensity))}
                                style={`--chance: ${percentage(minute.precipitationChance)};`} />
                        ))}
                    </div>
                    <footer className="x-label">
                        {groupLabelFor(i18n, segment[0].startTime, startTime)}
                    </footer>
                </section>
            ))}
        </div>
    );
}

function groupLabelFor(i18n: i18n, baseTime: Date, startTime: Date): string {
    if (baseTime === startTime) {
        return i18n.t('nextHourForecast.xLabelNow');
    } else {
        return i18n.t('nextHourForecast.xLabel', { minutes: differenceInMinutes(baseTime, startTime) });
    }
}
