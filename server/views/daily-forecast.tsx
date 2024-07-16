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

import { DailyForecast } from "fruit-company";
import { useContext } from "preact/hooks";
import { ThemeDecoration } from "../styling/themes";
import { Deps } from "./_deps";
import { Condition } from "./components/condition";
import { Weekday } from "./components/dates";
import { Decoration } from "./components/decoration";
import { Precipitation } from "./components/precipitation";
import { PercentageUnit, SpeedUnit, TemperatureRangeUnit, UVIndexUnit } from "./components/units";

export interface DailyForecastProps {
    readonly forecast?: DailyForecast;
}

export function DailyForecast({ forecast }: DailyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    const { i18n } = useContext(Deps);
    return (
        <section className="daily-forecast">
            <h1>
                {i18n.t("dailyForecast.title", { count: forecast.days.length })}
            </h1>
            <div className="daily-forecast-container orthogonal-scrollable">
                <ol className="daily-forecast-main">
                    {forecast.days.map(day => (
                        <li className="daily-forecast-reading-group">
                            <div className="daily-forecast-reading day">
                                <Weekday when={day.forecastStart} />
                            </div>
                            <div className="daily-forecast-reading condition">
                                <div className="daily-forecast-reading-condition-block">
                                    <Condition code={day.conditionCode} />
                                    <Precipitation probability={day.precipitationChance} />
                                </div>
                            </div>
                            <div className="daily-forecast-reading temperature-range">
                                <TemperatureRangeUnit max={day.temperatureMax} min={day.temperatureMin} compact={false} />
                            </div>
                            <div className="daily-forecast-reading humidity">
                                <header>{i18n.t("forecast.measurementLabels.humidity")}</header>
                                <div>
                                    <Decoration name={ThemeDecoration.daytime} /> <PercentageUnit measurement={day.daytimeForecast?.humidity} />
                                    {i18n.t('dailyForecast.dayNightSeparator')}
                                    <Decoration name={ThemeDecoration.overnight} /> <PercentageUnit measurement={day.overnightForecast?.humidity} />
                                </div>
                            </div>
                            <div className="daily-forecast-reading wind">
                                <header>{i18n.t("forecast.measurementLabels.wind")}</header>
                                <SpeedUnit measurement={day.windSpeedAvg} />
                            </div>
                            <div className="daily-forecast-reading uv-index">
                                <header>{i18n.t("forecast.measurementLabels.uvIndex")}</header>
                                <UVIndexUnit measurement={day.maxUvIndex} />
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}