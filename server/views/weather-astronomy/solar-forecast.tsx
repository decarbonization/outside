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

import { DayWeatherConditions } from "fruit-company";
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";
import { ShortTime } from "../components/dates";

export interface SolarForecastProps {
    readonly today?: DayWeatherConditions;
}

export function SolarForecast({ today }: SolarForecastProps) {
    if (today === undefined) {
        return null;
    }
    const { i18n } = useContext(Deps);
    return (
        <section className="solar-forecast">
            <h1>{i18n.t("solarForecast.title")}</h1>
            <ul className="h-flow centered spacing bottom-spacing">
                <li>
                    <header>{i18n.t("solarForecast.sunrise")}</header>
                    <ShortTime when={today.sunrise} />
                </li>
                <li>
                    <header>{i18n.t("solarForecast.sunriseAstronomical")}</header>
                    <ShortTime when={today.sunriseAstronomical} />
                </li>
                <li>
                    <header>{i18n.t("solarForecast.sunriseCivil")}</header>
                    <ShortTime when={today.sunriseCivil} />
                </li>
                <li>
                    <header>{i18n.t("solarForecast.sunriseNautical")}</header>
                    <ShortTime when={today.sunriseNautical} />
                </li>
            </ul>
            <ul className="h-flow centered spacing bottom-spacing">
                <li>
                    <header>{i18n.t("solarForecast.sunset")}</header>
                    <ShortTime when={today.sunset} />
                </li>
                <li>
                    <header>{i18n.t("solarForecast.sunsetAstronomical")}</header>
                    <ShortTime when={today.sunsetAstronomical} />
                </li>
                <li>
                    <header>{i18n.t("solarForecast.sunsetCivil")}</header>
                    <ShortTime when={today.sunsetCivil} />
                </li>
                <li>
                    <header>{i18n.t("solarForecast.sunsetNautical")}</header>
                    <ShortTime when={today.sunsetNautical} />
                </li>
            </ul>
            <ul className="h-flow centered spacing">
                <li>
                    <header>{i18n.t("solarForecast.solarNoon")}</header>
                    <ShortTime when={today.solarNoon} />
                </li>
                <li>
                    <header>{i18n.t("solarForecast.solarMidnight")}</header>
                    <ShortTime when={today.solarMidnight} />
                </li>
            </ul>
        </section>
    );
}
