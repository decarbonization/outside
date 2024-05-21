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

import { useContext } from "preact/hooks";
import { DailyForecast } from "../../fruit-company/weather/models/daily-forecast";
import { WeatherDecoration } from "../styling/themes";
import { Deps } from "./_deps";
import { Condition } from "./components/condition";
import { ShortTime, Weekday } from "./components/dates";
import { Moon } from "./components/moon";
import { Precipitation } from "./components/precipitation";
import { PercentageUnit, SpeedUnit, TemperatureRangeUnit, UVIndexUnit } from "./components/units";

export interface DailyForecastProps {
    readonly forecast?: DailyForecast;
}

export function DailyForecast({ forecast }: DailyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    const { i18n, theme } = useContext(Deps);
    return (
        <section className="daily-forecast">
            <h1>
                {i18n.t("dailyForecast.title", { count: forecast.days.length })}
            </h1>
            <ol className="daily-forecast-readings">
                {forecast.days.map(day => (
                    <li className="daily-forecast-reading-group">
                        <div className="daily-forecast-reading">
                            <header><Weekday when={day.forecastStart} /></header>
                            <Condition code={day.conditionCode} /> <Precipitation probability={day.precipitationChance} />
                        </div>
                        <div className="daily-forecast-reading">
                            <TemperatureRangeUnit max={day.temperatureMax} min={day.temperatureMin} compact={false} />
                        </div>
                        <div className="daily-forecast-reading">
                            <header>{i18n.t("forecast.measurementLabels.humidity")}</header>
                            <div>
                                <span className={theme.icons[WeatherDecoration.daytime]} /> <PercentageUnit measurement={day.daytimeForecast?.humidity} />
                                {i18n.t('dailyForecast.dayNightSeparator')}
                                <span className={theme.icons[WeatherDecoration.overnight]} /> <PercentageUnit measurement={day.overnightForecast?.humidity} />
                            </div>
                        </div>
                        <div className="daily-forecast-reading">
                            <header>{i18n.t("forecast.measurementLabels.wind")}</header>
                            <SpeedUnit measurement={day.windSpeedAvg} />
                        </div>
                        <div className="daily-forecast-reading">
                            <header>{i18n.t("forecast.measurementLabels.uvIndex")}</header>
                            <UVIndexUnit measurement={day.maxUvIndex} />
                        </div>
                        <div className="daily-forecast-reading">
                            <header>{i18n.t("forecast.measurementLabels.sunrise")}</header>
                            <ShortTime when={day.sunrise} />
                        </div>
                        <div className="daily-forecast-reading">
                            <header>{i18n.t("forecast.measurementLabels.sunset")}</header>
                            <ShortTime when={day.sunset} />
                        </div>
                        <div className="daily-forecast-reading">
                            <header>{i18n.t("forecast.measurementLabels.moonPhase")}</header>
                            <Moon phase={day.moonPhase} />
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}