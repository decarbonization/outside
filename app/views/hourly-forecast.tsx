import { t } from "i18next";
import { HourlyForecast } from "../../fruit-company/weather/models/hourly-forecast";
import { TemperatureUnit } from "./components/units";
import { Condition } from "./components/condition";

export interface HourlyForecastProps {
    readonly forecast?: HourlyForecast;
}

export function HourlyForecast({forecast}: HourlyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    const hours = forecast.hours;
    return (
        <section>
            <h1>{t("hourlyForecast.title", {count: hours.length})}</h1>
            <div className="tiles compact">
                {hours.map(hour => (
                    <div>
                        <div>
                            {t("hourlyForecast.time", {when: hour.forecastStart})}
                        </div>
                        <div>
                            <Condition code={hour.conditionCode} />
                        </div>
                        <div>
                            <TemperatureUnit measurement={hour.temperature} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}