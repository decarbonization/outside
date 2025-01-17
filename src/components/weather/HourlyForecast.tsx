/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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

import type { HourlyForecast, HourWeatherConditions, PrecipitationType } from "fruit-company/weather";
import { i18n } from "i18next";
import { chanceFragment, precipitationTypeFragment } from "../../formatting/fragments";
import { formatList } from "../../formatting/lists";
import { formatDepth } from "../../formatting/units";
import { useDeps } from "../../hooks/Deps";
import Condition from "../reusable/Condition";
import { Hour } from "../reusable/Dates";
import Precipitation from "../reusable/Precipitation";
import { CompassDirectionUnit, PercentageUnit, SpeedUnit, TemperatureUnit } from "../reusable/Units";

export interface HourlyForecastProps {
    readonly forecast?: HourlyForecast;
}

export default function HourlyForecast({ forecast }: HourlyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    const { i18n } = useDeps();
    const hours = forecast.hours;
    const summary = precipitationSummary(i18n, hours);
    return (
        <section className="hourly-forecast">
            <h1>{i18n.t("hourlyForecast.title", { count: hours.length })}</h1>
            <select className="hourly-forecast-selector">
                <option value="temperature">{i18n.t("forecast.measurementLabels.temperature")}</option>
                <option value="humidity">{i18n.t("forecast.measurementLabels.humidity")}</option>
                <option value="wind">{i18n.t("forecast.measurementLabels.wind")}</option>
            </select>
            {summary && (
                <p className="clear-both summary">
                    {summary}
                </p>
            )}
            <ol className="hourly-forecast-main clear-both h-flow orthogonal-scrollable">
                {hours.map(hour => (
                    <li className="hourly-forecast-reading-group differentiated">
                        <div className="hourly-forecast-reading conditions">
                            <Condition code={hour.conditionCode} daylight={hour.daylight} />
                            <Precipitation probability={hour.precipitationChance} amount={hour.precipitationAmount} />
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
                        <div className="hourly-forecast-reading hour">
                            <Hour when={hour.forecastStart} />
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}

function precipitationSummary(i18n: i18n, hours: HourWeatherConditions[]): string | undefined {
    const types = new Set<PrecipitationType>();
    let highestChance = 0;
    let totalPrecipitationAmount = 0;
    for (const { precipitationType, precipitationChance, precipitationAmount = 0 } of hours) {
        if (precipitationType === 'clear') {
            continue;
        }
        types.add(precipitationType);
        highestChance = Math.max(highestChance, precipitationChance);
        totalPrecipitationAmount += precipitationAmount;
    }
    if (types.size === 0 || highestChance <= 0.01 || totalPrecipitationAmount <= 1.0) {
        return undefined;
    }
    const typeFragments = Array.from(types, type => precipitationTypeFragment(type, { i18n, lowercase: true }));
    return i18n.t('hourlyForecast.summary', {
        chance: chanceFragment(highestChance, { i18n }),
        depth: formatDepth(totalPrecipitationAmount, { i18n }),
        conditions: formatList(typeFragments, { i18n }),
    });
}
