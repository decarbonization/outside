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

import { DayWeatherConditions } from "fruit-company/weather";
import { moonPhaseFragment } from "../../formatting/fragments";
import { useDeps } from "../_deps";
import Clock from "../components/Clock";
import { ShortTime } from "../components/Dates";
import Moon from "../components/Moon";

export interface SolarForecastProps {
    readonly today?: DayWeatherConditions;
}

export default function SolarForecast({ today }: SolarForecastProps) {
    if (today === undefined) {
        return null;
    }

    const { i18n } = useDeps();
    return (
        <section className="solar-forecast">
            <h1>{i18n.t("solarForecast.title")}</h1>
            <ol className="solar-forecast-main card-grid">
                <li className="solar-forecast-reading-group differentiated v-flow centered spacing">
                    <header>{i18n.t("solarForecast.sunrise")}</header>
                    <Clock time={today?.sunrise} />
                    <ShortTime when={today?.sunrise} />
                </li>
                <li className="solar-forecast-reading-group differentiated v-flow centered spacing">
                    <header>{i18n.t("solarForecast.sunset")}</header>
                    <Clock className="dark" time={today?.sunset} />
                    <ShortTime when={today?.sunset} />
                </li>
                <li className="solar-forecast-reading-group differentiated v-flow centered spacing">
                    <header>{i18n.t("solarForecast.moonrise")}</header>
                    <Clock time={today?.moonrise} />
                    <ShortTime when={today?.moonrise} />
                </li>
                <li className="solar-forecast-reading-group differentiated v-flow centered spacing">
                    <header>{i18n.t("solarForecast.moonset")}</header>
                    <Clock time={today?.moonset} />
                    <ShortTime when={today?.moonset} />
                </li>
                <li className="solar-forecast-reading-group differentiated v-flow centered spacing">
                    <header>{i18n.t("solarForecast.moonPhase")}</header>
                    <Moon phase={today?.moonPhase} />
                    <footer className="unit">
                        {today?.moonPhase && moonPhaseFragment(today.moonPhase, { i18n, lowercase: false })}
                    </footer>
                </li>
            </ol>
        </section>
    );
}
