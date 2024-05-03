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
            <div className="tiles compact">
                <div>
                    <Condition className="hero" code={now.conditionCode} />
                    &nbsp;
                    <TemperatureUnit className="hero" measurement={now.temperature} />
                </div>
                <div>
                    <header><TemperatureRangeUnit max={today?.temperatureMax} min={today?.temperatureMin} /></header>
                    {t("forecast.measurementLabels.feelsLike")} <TemperatureUnit measurement={now.temperatureApparent} />
                </div>
                <div>
                    <header>{t("forecast.measurementLabels.humidity")}</header>
                    <PercentageUnit measurement={now.humidity} />
                </div>
                <div>
                    <header>{t("forecast.measurementLabels.wind")}</header>
                    <SpeedUnit measurement={now.windSpeed} />
                    &nbsp;
                    <CompassDirectionUnit measurement={now.windDirection} />
                </div>
                <div>
                    <header>{t("forecast.measurementLabels.uvIndex")}</header>
                    <UVIndexUnit measurement={now.uvIndex} />
                </div>
                <div>
                    <header>{t("forecast.measurementLabels.pressure")}</header>
                    <PressureUnit measurement={now.pressure} /> <TrendUnitLabel measurement={now.pressureTrend} />
                </div>
                <div>
                    <header>{t("forecast.measurementLabels.visibility")}</header>
                    <VisibilityUnit measurement={now.visibility} />
                </div>
            </div>
            <footer>
                {t('weatherConditions.lastUpdated', {when: now.asOf})}
            </footer>
        </section>
    );
}
