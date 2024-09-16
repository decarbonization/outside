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

import classNames from "classnames";
import { useContext } from "preact/hooks";
import { LinkDestinationTo, linkTo, WeatherTab } from "../routes/_links";
import { Deps } from "./_deps";

export interface WeatherTabsProps {
    readonly selection: WeatherTab;
    readonly link: LinkDestinationTo<"weather">;
}

export function WeatherTabs({ selection, link }: WeatherTabsProps) {
    const { i18n } = useContext(Deps);
    return (
        <section className="weather-tabs">
            <a href={linkTo({ ...link, where: "weather", tab: "forecast" })} className={classNames({ selected: selection === "forecast" })}>
                {i18n.t("tabForecast")}
            </a>
            <a href={linkTo({ ...link, where: "weather", tab: "astronomy" })} className={classNames({ selected: selection === "astronomy" })}>
                {i18n.t("tabAstronomy")}
            </a>
            <a href={linkTo({ ...link, where: "weather", tab: "air" })} className={classNames({ selected: selection === "air" })}>
                {i18n.t("tabAir")}
            </a>
        </section>
    );
}
