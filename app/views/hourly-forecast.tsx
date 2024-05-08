import { t } from "i18next";
import { HourlyForecast } from "../../fruit-company/weather/models/hourly-forecast";
import { TemperatureUnit } from "./components/units";
import { Condition } from "./components/condition";
import { Hour } from "./components/dates";
import { Precipitation } from "./components/precipitation";

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
            <ol className="hours">
                {hours.map(hour => (
                    <li>
                        <div>
                            <Hour when={hour.forecastStart} />
                        </div>
                        <div>
                            <Condition code={hour.conditionCode} daylight={hour.daylight} />
                            <Precipitation probability={hour.precipitationChance} />
                        </div>
                        <div>
                            <TemperatureUnit measurement={hour.temperature} />
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}