import { t } from "i18next";
import { CurrentWeather } from "../../fruitkit/apple-weather/models/current-weather";
import { DayWeatherConditions } from "../../fruitkit/apple-weather/models/daily-forecast";
import { Condition } from "../condition";
import { CompassDirectionUnit, HumidityUnit, SpeedUnit, TemperatureRangeUnit, TemperatureUnit, UVIndexUnit, VisibilityUnit } from "../units";

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
                    <HumidityUnit measurement={now.humidity} />
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
                    {t(`forecast.pressureTrend.${now.pressureTrend}`, {defaultValue: now.pressureTrend})}
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
