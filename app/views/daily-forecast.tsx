import i18next, { t } from "i18next";
import { DailyForecast } from "../../fruitkit/apple-weather/models/daily-forecast";
import { Condition } from "../condition";
import { HumidityUnit, SpeedUnit, TemperatureRangeUnit, UVIndexUnit } from "../units";

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
                                <HumidityUnit measurement={day.daytimeForecast?.humidity} />
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.wind")}</header>
                                <SpeedUnit measurement={day.windSpeedMax} />
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
                                {t(`forecast.moonPhase.${day.moonPhase}`, { defaultValue: String(day.moonPhase) })}
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}