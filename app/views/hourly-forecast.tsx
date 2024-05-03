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
            <div className="tiles compact">
                {hours.map(hour => (
                    <div style="min-width: 60px">
                        <div>
                            <Hour when={hour.forecastStart} />
                        </div>
                        <div>
                            <Precipitation probability={hour.precipitationChance} type={hour.precipitationType} amount={hour.precipitationAmount}>
                                <Condition code={hour.conditionCode} />
                            </Precipitation>
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