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
import { WeatherAlertCollection } from "fruit-company/weather";
import { useContext } from "preact/hooks";
import { Deps } from "../_deps";

export interface WeatherAlertsProps {
    readonly collection?: WeatherAlertCollection;
}

export function WeatherAlerts({ collection }: WeatherAlertsProps) {
    if (collection === undefined || collection.alerts.length === 0) {
        return null;
    }
    const { i18n, timeZone } = useContext(Deps);
    return (
        <section className="weather-alerts">
            <h1 className="outset-top outset-bottom">
                {i18n.t("weatherAlerts.title")}
            </h1>
            <ol className="weather-alert-collection">
                {collection.alerts.map(alert => (
                    <li className={classNames("weather-alert", alert.certainty, alert.urgency, alert.severity)}>
                        <details>
                            <summary>{alert.description}</summary>
                            {i18n.t("weatherAlerts.details", {
                                interpolation: { escapeValue: false },
                                agency: alert.source,
                                effective: alert.effectiveTime,
                                expires: alert.expireTime,
                                timeZone,
                            })} <a href={alert.detailsUrl}>{i18n.t("weatherAlerts.moreInfo")}</a>
                        </details>
                    </li>
                ))}
            </ol>
        </section>
    );
}
