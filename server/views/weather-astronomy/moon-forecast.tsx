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
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";
import { ShortTime } from "../components/dates";
import { Moon } from "../components/moon";

export interface MoonForecastProps {
    readonly today?: DayWeatherConditions;
}

export function MoonForecast({ today }: MoonForecastProps) {
    if (today === undefined) {
        return null;
    }
    const { i18n } = useContext(Deps);
    return (
        <section className="moon-forecast">
            <h1>{i18n.t("moonForecast.title")}</h1>
            <ul className="h-flow spacing trailing">
                <li>
                    <Moon className="sidekick" phase={today.moonPhase} />
                    &nbsp;
                    {i18n.t(`forecast.moonPhase.${today.moonPhase}`, { defaultValue: String(today.moonPhase) })}
                </li>
                <li className="flexible-spacer" />
                <li>
                    <header>{i18n.t("moonForecast.moonrise")}</header>
                    <ShortTime when={today.moonrise} />
                </li>
                <li>
                    <header>{i18n.t("moonForecast.moonset")}</header>
                    <ShortTime when={today.moonset} />
                </li>
            </ul>
        </section>
    );
}
