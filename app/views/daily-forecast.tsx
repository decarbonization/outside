/*
 * outside weather app
 * Copyright (C) 2014  Peter "Kevin" Contreras
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

import { t } from "i18next";
import { DailyForecast } from "../../fruit-company/weather/models/daily-forecast";
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
    return (
        <section className="daily-forecast">
            <h1>
                {t("dailyForecast.title", { count: forecast.days.length })}
            </h1>
            <div className="table-container">
                <table>
                    {forecast.days.map(day => (
                        <tr>
                            <td>
                                <header><Weekday when={day.forecastStart} /></header>
                                <Condition code={day.conditionCode} /> <Precipitation probability={day.precipitationChance} />
                            </td>
                            <td>
                                <TemperatureRangeUnit max={day.temperatureMax} min={day.temperatureMin} compact={false} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.humidity")}</header>
                                <span className="wi wi-day-sunny" /> <PercentageUnit measurement={day.daytimeForecast?.humidity} />
                                {t('dailyForecast.dayNightSeparator')}
                                <span className="wi wi-night-clear" /> <PercentageUnit measurement={day.overnightForecast?.humidity} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.wind")}</header>
                                <SpeedUnit measurement={day.windSpeedAvg} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.uvIndex")}</header>
                                <UVIndexUnit measurement={day.maxUvIndex} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.sunrise")}</header>
                                <ShortTime when={day.sunrise} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.sunset")}</header>
                                <ShortTime when={day.sunset} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.moonPhase")}</header>
                                <Moon phase={day.moonPhase} />
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </section>
    );
}