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
            <ol className="current-forecast-main orthogonal-scrollable">
                <li className="current-forecast-reading">
                    <Condition className="hero" code={now.conditionCode} daylight={now.daylight} />
                </li>
                <li className="current-forecast-reading">
                    <TemperatureUnit className="hero" measurement={now.temperature} />
                    <footer>
                        {i18n.t("forecast.measurementLabels.feelsLike")}
                        &nbsp;
                        <TemperatureUnit measurement={now.temperatureApparent} />
                    </footer>
                </li>
                <li className="current-forecast-reading">
                    <TemperatureRangeUnit max={today?.temperatureMax} min={today?.temperatureMin} compact={false} />
                </li>
                <li className="current-forecast-reading nowrap">
                    <Decoration name={ThemeDecoration.humidity} />
                    &nbsp;
                    <PercentageUnit measurement={now.humidity} />
                    <div>
                        {i18n.t("forecast.measurementLabels.dewPoint")}
                        &nbsp;
                        <TemperatureUnit measurement={now.temperatureDewPoint} />
                    </div>
                </li>
                <li className="current-forecast-reading nowrap">
                    <Decoration name={ThemeDecoration.wind} />
                    &nbsp;
                    <SpeedUnit measurement={now.windSpeed} />
                    &nbsp;
                    <CompassDirectionUnit measurement={now.windDirection} />
                    <div>
                        {i18n.t("forecast.measurementLabels.windGusts")}
                        &nbsp;
                        <SpeedUnit measurement={now.windGust} />
                    </div>
                </li>
                <li className="current-forecast-reading nowrap">
                    <Decoration name={ThemeDecoration.uvIndex} />
                    &nbsp;
                    <UVIndexUnit measurement={now.uvIndex} />
                </li>
            </ol>
            <footer className="last-updated" data-expires={now.metadata.expireTime.toISOString()}>
                {i18n.t("forecast.lastUpdated", { when: now.asOf, timeZone })}
            </footer>
        </section>
    );
}
