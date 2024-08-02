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
import { ForecastMinute, precipitationIntensityFrom } from "fruit-company/weather";
import { segmentBy } from "../../utilities/array-utils";
import { differenceInMinutes } from "date-fns";
import { i18n } from "i18next";
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";

export interface PrecipitationChartProps {
    readonly className?: string;
    readonly samples: ForecastMinute[];
    readonly groupSize?: number;
    readonly maxGroups?: number;
}

export function PrecipitationChart({
    className,
    samples,
    groupSize = 10,
    maxGroups = 6,
}: PrecipitationChartProps) {
    if (!samples.some(m => m.precipitationChance > 0)) {
        return null;
    }
    const { i18n } = useContext(Deps);
    const startTime = samples[0].startTime;
    const segments = segmentBy(samples, groupSize).slice(0, maxGroups);
    return (
        <div className={classNames("precipitation-chart", "h-flow", className)}>
            {segments.map(segment => (
                <section>
                    <div className="group">
                        {segment.map(minute => (
                            <div
                                className={classNames("minute", precipitationIntensityFrom(minute.precipitationIntensity))}
                                style={`--chance: ${Math.round(minute.precipitationChance * 100)}%;`} />
                        ))}
                    </div>
                    <footer>
                        {groupLabel(i18n, segment[0].startTime, startTime)}
                    </footer>
                </section>
            ))}
        </div>
    );
}

function groupLabel(i18n: i18n, baseTime: Date, startTime: Date): string {
    if (baseTime === startTime) {
        return i18n.t('nextHourForecast.groupLabelNow');
    } else {
        return i18n.t('nextHourForecast.groupLabel', { minutes: differenceInMinutes(baseTime, startTime) });
    }
}
