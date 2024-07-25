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
import { Deps } from "./_deps";
import classNames from "classnames";
import { GetWeatherLinkOptions, WeatherRoutes } from "../routes/weather-routes";
import { AstronomyRoutes } from "../routes/astronomy-routes";
import { AirQualityRoutes } from "../routes/air-quality-routes";

export type Mode =
    | "weather"
    | "astronomy"
    | "airQuality";

export interface ModeSelectorProps {
    readonly mode: Mode;
    readonly link: GetWeatherLinkOptions;
}

export function ModeSelector({ mode, link }: ModeSelectorProps) {
    const { i18n } = useContext(Deps);
    return (
        <section className="mode-selector">
            <a href={WeatherRoutes.linkToGetWeather(link)} className={classNames({selected: mode === "weather"})}>
                {i18n.t("tabWeather")}
            </a>
            <a href={AstronomyRoutes.linkToGetAstronomy(link)} className={classNames({selected: mode === "astronomy"})}>
                {i18n.t("tabAstronomy")}
            </a>
            <a href={AirQualityRoutes.linkToGetAirQuality(link)} className={classNames({selected: mode === "airQuality"})}>
                {i18n.t("tabAirQuality")}
            </a>
        </section>
    );
}
