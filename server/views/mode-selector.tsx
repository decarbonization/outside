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
import { LinkDestinationTo, linkTo } from "../routes/_links";
import { Deps } from "./_deps";

export type Mode =
    | "forecast"
    | "astronomy"
    | "air";

export interface ModeSelectorProps {
    readonly mode: Mode;
    readonly link: LinkDestinationTo<"weather">;
}

export function ModeSelector({ mode, link }: ModeSelectorProps) {
    const { i18n } = useContext(Deps);
    return (
        <section className="mode-selector">
            <a href={linkTo({ ...link, where: "weather", sub: undefined })} className={classNames({ selected: mode === "forecast" })}>
                {i18n.t("tabForecast")}
            </a>
            <a href={linkTo({ ...link, where: "weather", sub: "astronomy" })} className={classNames({ selected: mode === "astronomy" })}>
                {i18n.t("tabAstronomy")}
            </a>
            <a href={linkTo({ ...link, where: "weather", sub: "air" })} className={classNames({ selected: mode === "air" })}>
                {i18n.t("tabAir")}
            </a>
        </section>
    );
}
