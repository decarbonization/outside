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

import { DailyForecast } from "fruit-company/weather";
import { useContext } from "preact/hooks";
import { ThemeDecoration } from "../../styling/themes";
import { Deps } from "../_deps";
import { Condition } from "../components/condition";
import { Weekday } from "../components/dates";
import { Decoration } from "../components/decoration";
import { Precipitation } from "../components/precipitation";
import { PercentageUnit, SpeedUnit, TemperatureRangeUnit } from "../components/units";

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
            <h1>{i18n.t("dailyForecast.title", { count: forecast.days.length })}</h1>
            <select className="daily-forecast-selector">
                <option value="temperature">{i18n.t("forecast.measurementLabels.temperature")}</option>
                <option value="humidity">{i18n.t("forecast.measurementLabels.humidity")}</option>
                <option value="wind">{i18n.t("forecast.measurementLabels.wind")}</option>
            </select>
            <ol className="daily-forecast-main">
                {forecast.days.map(day => (
                    <li className="daily-forecast-reading-group v-flow centered spacing">
                        <header className="daily-forecast-reading day">
                            <Weekday when={day.forecastStart} />
                        </header>
                        <div className="daily-forecast-reading condition">
                            <div className="daily-forecast-reading-condition-block">
                                <Condition code={day.conditionCode} />
                                <Precipitation probability={day.precipitationChance} />
                            </div>
                        </div>
                        <div className="daily-forecast-reading temperature">
                            <TemperatureRangeUnit max={day.temperatureMax} min={day.temperatureMin} compact={false} />
                        </div>
                        <div className="daily-forecast-reading humidity">
                            <Decoration name={ThemeDecoration.daytime} /> <PercentageUnit measurement={day.daytimeForecast?.humidity} />
                            <br />
                            <Decoration name={ThemeDecoration.overnight} /> <PercentageUnit measurement={day.overnightForecast?.humidity} />
                        </div>
                        <div className="daily-forecast-reading wind">
                            <SpeedUnit className="speed" measurement={day.windSpeedAvg} />
                            <SpeedUnit className="gust" measurement={day.windGustSpeedMax} />
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}