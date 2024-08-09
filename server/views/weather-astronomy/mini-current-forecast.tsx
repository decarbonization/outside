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

import { CurrentWeather } from "fruit-company/weather";
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";
import { Condition } from "../components/condition";
import { CompassDirectionUnit, PercentageUnit, SpeedUnit, TemperatureUnit, VisibilityUnit } from "../components/units";

export interface MiniCurrentForecastProps {
    readonly now?: CurrentWeather;
}

export function MiniCurrentForecast({ now }: MiniCurrentForecastProps) {
    if (now === undefined) {
        return null;
    }
    const { i18n, timeZone } = useContext(Deps);
    return (
        <section className="mini current-forecast">
            <ul className="h-flow spacing trailing outset-bottom">
                <li className="sidekick">
                    <Condition code={now.conditionCode} />
                    <TemperatureUnit measurement={now.temperature} />
                </li>
                <li className="flexible-spacer" />
                <li>
                    <header>{i18n.t("forecast.measurementLabels.wind")}</header>
                    <SpeedUnit measurement={now.windSpeed} /> <CompassDirectionUnit measurement={now.windDirection} />
                    {now.windGust !== undefined
                        ? <SpeedUnit className="gust" measurement={now.windGust} />
                        : null}
                </li>
                <li>
                    <header>{i18n.t('forecast.measurementLabels.visibility')}</header>
                    <VisibilityUnit measurement={now.visibility} />
                </li>
                <li>
                    <header>{i18n.t('forecast.measurementLabels.cloudCover')}</header>
                    <PercentageUnit measurement={now.cloudCover} />
                </li>
            </ul>
            <footer className="last-updated" data-expires={now.metadata.expireTime.toISOString()}>
                {i18n.t("forecast.lastUpdated", { interpolation: { escapeValue: false }, when: now.asOf, timeZone })}
            </footer>
        </section>
    );
}
