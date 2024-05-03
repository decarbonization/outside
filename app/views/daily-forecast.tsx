import { t } from "i18next";
import { DailyForecast } from "../../fruit-company/weather/models/daily-forecast";
import { Condition } from "./components/condition";
import { Time, Weekday } from "./components/dates";
import { Moon } from "./components/moon";
import { HumidityUnit, SpeedUnit, TemperatureRangeUnit, UVIndexUnit } from "./components/units";

export interface DailyForecastProps {
    readonly forecast?: DailyForecast;
}

export function DailyForecast({ forecast }: DailyForecastProps) {
    if (forecast === undefined) {
        return null;
    }
    return (
        <section>
            <h1>
                {t("dailyForecast.title", { count: forecast.days.length })}
            </h1>
            <ol className="forecast">
                {forecast.days.map(day => (
                    <li key={day.forecastStart.toISOString()}>
                        <div className="tiles compact">
                            <div>
                                <header><Condition code={day.conditionCode} />&nbsp;<Weekday when={day.forecastStart} /></header>
                                <TemperatureRangeUnit max={day.temperatureMax} min={day.temperatureMin} />
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.humidity")}</header>
                                <span className="wi wi-day-sunny" /> <HumidityUnit measurement={day.daytimeForecast?.humidity} />
                                {t('dailyForecast.dayNightSeparator')}
                                <span className="wi wi-night-clear" /> <HumidityUnit measurement={day.overnightForecast?.humidity} />
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.wind")}</header>
                                <SpeedUnit measurement={day.windSpeedAvg} />
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.uvIndex")}</header>
                                <UVIndexUnit measurement={day.maxUvIndex} />
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.sunrise")}</header>
                                <Time className="unit" when={day.sunrise} />
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.sunset")}</header>
                                <Time className="unit" when={day.sunset} />
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.moonPhase")}</header>
                                <Moon phase={day.moonPhase} />
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}