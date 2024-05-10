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
import { HourlyForecast } from "../../fruit-company/weather/models/hourly-forecast";
import { TemperatureUnit } from "./components/units";
import { Condition } from "./components/condition";
import { Hour } from "./components/dates";
import { Precipitation } from "./components/precipitation";

export interface HourlyForecastProps {
    readonly forecast?: HourlyForecast;
}

export function HourlyForecast({forecast}: HourlyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    const hours = forecast.hours;
    return (
        <section className="hourly-forecast">
            <h1>{t("hourlyForecast.title", {count: hours.length})}</h1>
            <ol>
                {hours.map(hour => (
                    <li>
                        <div>
                            <Hour when={hour.forecastStart} />
                        </div>
                        <div className="conditions">
                            <Condition code={hour.conditionCode} daylight={hour.daylight} />
                            <Precipitation probability={hour.precipitationChance} />
                        </div>
                        <div>
                            <TemperatureUnit measurement={hour.temperature} />
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}