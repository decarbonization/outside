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

import { HourlyForecast } from "fruit-company";
import { useContext } from "preact/hooks";
import { Deps } from "./_deps";
import { Condition } from "./components/condition";
import { Hour } from "./components/dates";
import { Precipitation } from "./components/precipitation";
import { CompassDirectionUnit, PercentageUnit, SpeedUnit, TemperatureUnit, UVIndexUnit } from "./components/units";

export interface HourlyForecastProps {
    readonly forecast?: HourlyForecast;
}

export function HourlyForecast({ forecast }: HourlyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    const { i18n } = useContext(Deps);
    const hours = forecast.hours;
    return (
        <section className="hourly-forecast">
            <h1>{i18n.t("hourlyForecast.title", { count: hours.length })}</h1>
            <select className="hourly-forecast-selector">
                <option value="temperature">{i18n.t("forecast.measurementLabels.temperature")}</option>
                <option value="humidity">{i18n.t("forecast.measurementLabels.humidity")}</option>
                <option value="wind">{i18n.t("forecast.measurementLabels.wind")}</option>
                <option value="uv-index">{i18n.t("forecast.measurementLabels.uvIndex")}</option>
                <option value="cloud-cover">{i18n.t("forecast.measurementLabels.cloudCover")}</option>
            </select>
            <ol className="hourly-forecast-main orthogonal-scrollable">
                {hours.map(hour => (
                    <li className="hourly-forecast-reading-group">
                        <div className="hourly-forecast-reading conditions">
                            <Condition code={hour.conditionCode} daylight={hour.daylight} />
                            <Precipitation probability={hour.precipitationChance} />
                        </div>
                        <div className="hourly-forecast-reading temperature">
                            <TemperatureUnit measurement={hour.temperature} />
                        </div>
                        <div className="hourly-forecast-reading humidity">
                            <PercentageUnit measurement={hour.humidity} />
                        </div>
                        <div className="hourly-forecast-reading wind">
                            <SpeedUnit className="speed" measurement={hour.windSpeed} />&nbsp;<CompassDirectionUnit measurement={hour.windDirection} />
                            <SpeedUnit className="gust" measurement={hour.windGust} />
                        </div>
                        <div className="hourly-forecast-reading uv-index">
                            <UVIndexUnit measurement={hour.uvIndex} />
                        </div>
                        <div className="hourly-forecast-reading cloud-cover">
                            <PercentageUnit measurement={hour.cloudCover} />
                        </div>
                        <div className="hourly-forecast-reading hour">
                            <Hour when={hour.forecastStart} />
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
