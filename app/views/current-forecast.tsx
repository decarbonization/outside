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
import { CurrentWeather } from "../../fruit-company/weather/models/current-weather";
import { DayWeatherConditions } from "../../fruit-company/weather/models/daily-forecast";
import { Condition } from "./components/condition";
import { CompassDirectionUnit, PercentageUnit, PressureUnit, SpeedUnit, TemperatureRangeUnit, TemperatureUnit, TrendUnitLabel, UVIndexUnit, VisibilityUnit } from "./components/units";

export interface CurrentForecastProps {
    readonly now?: CurrentWeather;
    readonly today?: DayWeatherConditions;
}

export function CurrentForecast({now, today}: CurrentForecastProps) {
    if (now === undefined) {
        return null;
    }
    
    return (
        <section className="current-forecast">
            <ul>
                <li>
                    <Condition className="hero" code={now.conditionCode} daylight={now.daylight} />
                    &nbsp;
                    <TemperatureUnit className="hero" measurement={now.temperature} />
                    <footer>
                        {t("forecast.measurementLabels.feelsLike")}&nbsp;<TemperatureUnit measurement={now.temperatureApparent} />
                    </footer>
                </li>
                <li>
                    <TemperatureRangeUnit max={today?.temperatureMax} min={today?.temperatureMin} compact={false} />
                    <footer>
                        &nbsp;
                    </footer>
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.humidity")}</header>
                    <PercentageUnit measurement={now.humidity} />
                    <footer>
                        {t("forecast.measurementLabels.dewPoint")}&nbsp;<TemperatureUnit measurement={now.temperatureDewPoint} />
                    </footer>
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.wind")}</header>
                    <SpeedUnit measurement={now.windSpeed} />
                    &nbsp;
                    <CompassDirectionUnit measurement={now.windDirection} />
                    <footer>
                        {t("forecast.measurementLabels.windGusts")}&nbsp;<SpeedUnit measurement={now.windGust} />
                    </footer>
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.uvIndex")}</header>
                    <UVIndexUnit measurement={now.uvIndex} />
                    <footer>
                        &nbsp;
                    </footer>
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.pressure")}</header>
                    <PressureUnit measurement={now.pressure} />&nbsp;<TrendUnitLabel measurement={now.pressureTrend} />
                    <footer>
                        &nbsp;
                    </footer>
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.visibility")}</header>
                    <VisibilityUnit measurement={now.visibility} />
                    <footer>
                        {t("forecast.measurementLabels.cloudCover")}&nbsp;<PercentageUnit measurement={now.cloudCover} />
                    </footer>
                </li>
            </ul>
        </section>
    );
}
