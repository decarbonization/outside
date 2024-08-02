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

import { PollenForecast } from "good-breathing/pollen";
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";
import { Weekday } from "../components/dates";

export interface PollenDailyForecastProps {
    readonly forecast?: PollenForecast;
}

export function PollenDailyForecast({ forecast }: PollenDailyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    const { i18n } = useContext(Deps);
    const days = forecast.dailyInfo;
    return (
        <section className="pollen-daily-forecast">
            <h1>{i18n.t("dailyPollenForecast.title", { count: days.length })}</h1>
            {days.map(dayInfo => (
                <>
                    <h2><Weekday when={dayInfo.date} /></h2>
                    <ol className="pollen-daily-forecast-day-main">
                        {dayInfo.pollenTypeInfo.map(pollenInfo => (
                            <li className="pollen-daily-forecast-day-reading-group v-flow centered spacing">
                                <header className="pollen-daily-forecast-day-reading name">
                                    {pollenInfo.displayName}
                                </header>
                                <div className="pollen-daily-forecast-day-reading category" style={`color: ${pollenInfo.indexInfo?.color.cssColor ?? 'currentColor'};`}>
                                    {pollenInfo.indexInfo?.category ?? "--"}
                                </div>
                                <footer className="pollen-daily-forecast-day-reading description">
                                    {pollenInfo.indexInfo?.indexDescription ?? "--"}
                                </footer>
                                {pollenInfo.healthRecommendations?.map(recommendation => (
                                    <footer className="pollen-daily-forecast-day-reading recommendation">
                                        {recommendation}
                                    </footer>
                                ))}
                            </li>
                        ))}
                    </ol>
                </>
            ))}
        </section>
    );
}

