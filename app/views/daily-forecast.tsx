import { t } from "i18next";
import { DailyForecast } from "../../fruit-company/weather/models/daily-forecast";
import { Condition, ConditionDisplayStyle } from "./components/condition";
import { ShortDate, ShortTime, Weekday } from "./components/dates";
import { Moon } from "./components/moon";
import { PercentageUnit, SpeedUnit, TemperatureRangeUnit, UVIndexUnit } from "./components/units";
import { Precipitation } from "./components/precipitation";
import { uvIndexRiskFrom } from "../../fruit-company/weather/models/base";

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
            <div className="table-container">
                <table>
                    {forecast.days.map(day => (
                        <tr>
                            <td>
                                <header><Weekday when={day.forecastStart} /></header>
                                <Precipitation probability={day.precipitationChance} type={day.precipitationType} amount={day.precipitationAmount}>
                                    <Condition code={day.conditionCode} displayStyle={ConditionDisplayStyle.iconOnly} />
                                </Precipitation>
                            </td>
                            <td>
                                <TemperatureRangeUnit max={day.temperatureMax} min={day.temperatureMin} compact={false} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.humidity")}</header>
                                <span className="wi wi-day-sunny" /> <PercentageUnit measurement={day.daytimeForecast?.humidity} />
                                {t('dailyForecast.dayNightSeparator')}
                                <span className="wi wi-night-clear" /> <PercentageUnit measurement={day.overnightForecast?.humidity} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.wind")}</header>
                                <SpeedUnit measurement={day.windSpeedAvg} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.uvIndex")}</header>
                                <UVIndexUnit measurement={day.maxUvIndex} />&nbsp;{t(`forecast.uvIndexRisk.${uvIndexRiskFrom(day.maxUvIndex)}`)}
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.sunrise")}</header>
                                <ShortTime when={day.sunrise} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.sunset")}</header>
                                <ShortTime when={day.sunset} />
                            </td>
                            <td>
                                <header>{t("forecast.measurementLabels.moonPhase")}</header>
                                <Moon phase={day.moonPhase} />
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </section>
    );
}