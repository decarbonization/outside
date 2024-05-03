import i18next, { t } from "i18next";
import { DailyForecast } from "../../fruit-company/weather/models/daily-forecast";
import { Condition } from "./components/condition";
import { HumidityUnit, SpeedUnit, TemperatureRangeUnit, UVIndexUnit } from "./components/units";
import { Moon } from "./components/moon";

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
                                <header><Condition code={day.conditionCode} />&nbsp;{t("dailyForecast.weekday", { start: day.forecastStart })}</header>
                                <TemperatureRangeUnit max={day.temperatureMax} min={day.temperatureMin} />
                            </div>
                            <div>
                                <header>Humidity</header>
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
                                <header>Sunrise</header>
                                {i18next.format(day.sunrise, "datetime", undefined, { timeStyle: 'short' })}
                            </div>
                            <div>
                                <header>Sunset</header>
                                {i18next.format(day.sunset, "datetime", undefined, { timeStyle: 'short' })}
                            </div>
                            <div>
                                <header>Moon</header>
                                <Moon phase={day.moonPhase} />
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}