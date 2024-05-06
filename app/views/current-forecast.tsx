import { t } from "i18next";
import { CurrentWeather } from "../../fruit-company/weather/models/current-weather";
import { DayWeatherConditions } from "../../fruit-company/weather/models/daily-forecast";
import { Condition } from "./components/condition";
import { CompassDirectionUnit, PercentageUnit, PressureUnit, SpeedUnit, TemperatureRangeUnit, TemperatureUnit, TrendUnitLabel, UVIndexUnit, VisibilityUnit } from "./components/units";

export interface CurrentForecastProps {
    readonly now?: CurrentWeather;
    readonly today?: DayWeatherConditions;
}

export function CurrentForecast({now, today}: CurrentForecastProps) {
    if (now === undefined) {
        return null;
    }
    
    return (
        <section>
            <ul className="conditions">
                <li>
                    <Condition className="hero" code={now.conditionCode} />
                    &nbsp;
                    <TemperatureUnit className="hero" measurement={now.temperature} />
                </li>
                <li>
                    <header><TemperatureRangeUnit max={today?.temperatureMax} min={today?.temperatureMin} /></header>
                    {t("forecast.measurementLabels.feelsLike")} <TemperatureUnit measurement={now.temperatureApparent} />
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.humidity")}</header>
                    <PercentageUnit measurement={now.humidity} />
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.wind")}</header>
                    <SpeedUnit measurement={now.windSpeed} />
                    &nbsp;
                    <CompassDirectionUnit measurement={now.windDirection} />
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.uvIndex")}</header>
                    <UVIndexUnit measurement={now.uvIndex} />
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.pressure")}</header>
                    <PressureUnit measurement={now.pressure} />&nbsp;<TrendUnitLabel measurement={now.pressureTrend} />
                </li>
                <li>
                    <header>{t("forecast.measurementLabels.visibility")}</header>
                    <VisibilityUnit measurement={now.visibility} />
                </li>
            </ul>
            <footer>
                {t('weatherConditions.lastUpdated', {when: now.asOf})}
            </footer>
        </section>
    );
}
