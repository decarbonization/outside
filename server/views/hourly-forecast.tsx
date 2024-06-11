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
import { HourlyForecast } from "../../fruit-company/weather/models/hourly-forecast";
import { Deps } from "./_deps";
import { Condition } from "./components/condition";
import { Hour } from "./components/dates";
import { Precipitation } from "./components/precipitation";
import { CompassDirectionUnit, PercentageUnit, PressureUnit, SpeedUnit, TemperatureUnit, TrendUnitLabel, UVIndexUnit, VisibilityUnit } from "./components/units";
import { Decoration } from "./components/decoration";
import { ThemeDecoration } from "../styling/themes";

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
            <SelectionTab id="hourly-forecast-temperature" decoration={ThemeDecoration.temperature} checked />
            <SelectionTab id="hourly-forecast-humidity" decoration={ThemeDecoration.humidity} />
            <SelectionTab id="hourly-forecast-wind" decoration={ThemeDecoration.wind} />
            <SelectionTab id="hourly-forecast-uv-index" decoration={ThemeDecoration.uvIndex} />
            <SelectionTab id="hourly-forecast-pressure" decoration={ThemeDecoration.pressure} />
            <SelectionTab id="hourly-forecast-visibility" decoration={ThemeDecoration.visibility} />
            <ol className="hourly-forecast-main orthogonal-scrollable">
                {hours.map(hour => (
                    <li className="hourly-forecast-reading-group">
                        <div className="hourly-forecast-reading conditions">
                            <Condition code={hour.conditionCode} daylight={hour.daylight} />
                            <Precipitation probability={hour.precipitationChance} />
                        </div>
                        <div className="hourly-forecast-reading selectable temperature">
                            <TemperatureUnit measurement={hour.temperature} />
                        </div>
                        <div className="hourly-forecast-reading selectable humidity">
                            <PercentageUnit measurement={hour.humidity} />
                        </div>
                        <div className="hourly-forecast-reading selectable wind">
                            <SpeedUnit measurement={hour.windSpeed} />&nbsp;<CompassDirectionUnit measurement={hour.windDirection} />
                        </div>
                        <div className="hourly-forecast-reading selectable uv-index">
                            <UVIndexUnit measurement={hour.uvIndex} />
                        </div>
                        <div className="hourly-forecast-reading selectable pressure">
                            <PressureUnit measurement={hour.pressure} />&nbsp;<TrendUnitLabel measurement={hour.pressureTrend} />
                        </div>
                        <div className="hourly-forecast-reading selectable visibility">
                            <VisibilityUnit measurement={hour.visibility} />
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

interface SelectionTabProps {
    readonly id: string;
    readonly decoration: ThemeDecoration;
    readonly checked?: boolean;
}

function SelectionTab({ id, decoration, checked }: SelectionTabProps) {
    return (
        <>
            <input type="radio" name="hourly-forecast-selection" id={id} checked={checked} />
            <label for={id}><Decoration name={decoration} /></label>
        </>
    );
}
