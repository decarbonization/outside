import classNames from "classnames";
import { WeatherAlertCollection } from "fruit-company";
import { useContext } from "preact/hooks";
import { Deps } from "./_deps";

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
            <h1>
                {i18n.t("weatherAlerts.title")}
            </h1>
            <ol className="weather-alert-collection">
                {collection.alerts.map(alert => (
                    <li className={classNames("weather-alert", alert.certainty, alert.urgency, alert.severity)}>
                        <details>
                            <summary>{alert.areaName}: {alert.description}</summary>
                            {i18n.t("weatherAlerts.details", {
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
