import { t } from "i18next";
import { DailyForecast } from "../../fruit-company/weather/models/daily-forecast";
import { Condition } from "./components/condition";
import { ShortDate, ShortTime, Weekday } from "./components/dates";
import { Moon } from "./components/moon";
import { PercentageUnit, SpeedUnit, TemperatureRangeUnit, UVIndexUnit } from "./components/units";
import { Precipitation } from "./components/precipitation";

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
                                <header><Weekday when={day.forecastStart} /></header>
                                <ShortDate when={day.forecastStart} />
                            </div>
                            <div>
                                <header>
                                    <TemperatureRangeUnit max={day.temperatureMax} min={day.temperatureMin} />
                                </header>
                                <Precipitation probability={day.precipitationChance} type={day.precipitationType} amount={day.precipitationAmount}>
                                    <Condition code={day.conditionCode} labeled={true} />
                                </Precipitation>
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.humidity")}</header>
                                <span className="wi wi-day-sunny" /> <PercentageUnit measurement={day.daytimeForecast?.humidity} />
                                {t('dailyForecast.dayNightSeparator')}
                                <span className="wi wi-night-clear" /> <PercentageUnit measurement={day.overnightForecast?.humidity} />
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
                                <ShortTime className="unit" when={day.sunrise} />
                            </div>
                            <div>
                                <header>{t("forecast.measurementLabels.sunset")}</header>
                                <ShortTime className="unit" when={day.sunset} />
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