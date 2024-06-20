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

import { CurrentWeather, DayWeatherConditions } from "fruit-company";
import { useContext } from "preact/hooks";
import { ThemeDecoration } from "../styling/themes";
import { Deps } from "./_deps";
import { Condition } from "./components/condition";
import { Decoration } from "./components/decoration";
import { CompassDirectionUnit, PercentageUnit, SpeedUnit, TemperatureRangeUnit, TemperatureUnit, UVIndexUnit } from "./components/units";

export interface CurrentForecastProps {
    readonly now?: CurrentWeather;
    readonly today?: DayWeatherConditions;
}

export function CurrentForecast({ now, today }: CurrentForecastProps) {
    if (now === undefined) {
        return null;
    }
    const { i18n, timeZone } = useContext(Deps);
    return (
        <section className="current-forecast">
            <Condition className="superhero" code={now.conditionCode} daylight={now.daylight} />
            <ol className="current-forecast-reading-group">
                <li className="current-forecast-reading">
                    <TemperatureUnit className="hero" measurement={now.temperature} />
                </li>
                <li className="current-forecast-reading">
                    <TemperatureRangeUnit max={today?.temperatureMax} min={today?.temperatureMin} compact={false} />
                </li>
            </ol>
            <ol className="current-forecast-reading-group">
                <li className="current-forecast-reading">
                    <header>{i18n.t("forecast.measurementLabels.feelsLike")}</header>
                    <TemperatureUnit measurement={now.temperatureApparent} />
                </li>
                <li className="current-forecast-reading">
                    <header>{i18n.t("forecast.measurementLabels.humidity")}</header>
                    <PercentageUnit measurement={now.humidity} />
                </li>
                <li className="current-forecast-reading">
                    <header>{i18n.t("forecast.measurementLabels.dewPoint")}</header>
                    <TemperatureUnit measurement={now.temperatureDewPoint} />
                </li>
                <li className="current-forecast-reading">
                    <header>{i18n.t("forecast.measurementLabels.wind")}</header>
                    <SpeedUnit measurement={now.windSpeed} />
                </li>
                {now.windGust !== undefined ? <li className="current-forecast-reading">
                    <header>{i18n.t("forecast.measurementLabels.windGusts")}</header>
                    <SpeedUnit measurement={now.windGust} />
                </li> : null}
                <li className="current-forecast-reading">
                    <header>{i18n.t("forecast.measurementLabels.uvIndex")}</header>
                    <UVIndexUnit measurement={now.uvIndex} />
                </li>
            </ol>
            <footer className="last-updated" data-expires={now.metadata.expireTime.toISOString()}>
                {i18n.t("forecast.lastUpdated", { when: now.asOf, timeZone })}
            </footer>
        </section>
    );
}
