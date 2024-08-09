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

import { Attribution, Weather } from "fruit-company/weather";
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";

export interface WeatherSourceProps {
    readonly weather?: Weather;
    readonly attribution?: Attribution;
}

export function WeatherSource({ weather, attribution }: WeatherSourceProps) {
    if (weather === undefined || attribution === undefined) {
        return null;
    }
    const { i18n } = useContext(Deps);
    const attributionURL = [
        weather.currentWeather?.metadata.attributionURL,
        weather.forecastNextHour?.metadata.attributionURL,
        weather.forecastHourly?.metadata.attributionURL,
        weather.forecastDaily?.metadata.attributionURL,
    ].find(url => url !== undefined);
    return (
        <section className="data-source">
            {i18n.t("appPoweredBy")}
            &nbsp;
            <a href={attributionURL}>
                <picture>
                    <source srcset={`${attribution['logoDark@1x']}, ${attribution['logoDark@2x']} 2x, ${attribution['logoDark@3x']} 3x`} media="(prefers-color-scheme: dark)" />
                    <source srcset={`${attribution['logoLight@1x']}, ${attribution['logoLight@2x']} 2x, ${attribution['logoLight@3x']} 3x`} />
                    <img src={attribution['logoLight@1x']} alt={attribution.serviceName} />
                </picture>
            </a>
        </section>
    );
}
