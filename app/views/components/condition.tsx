import { t } from "i18next";
import { WeatherCondition } from "../../../fruit-company/weather/models/base";

const codeClassNames = {
    [WeatherCondition.blowingDust]: "wi-dust",
    [WeatherCondition.clear]: "wi-day-sunny",
    [WeatherCondition.cloudy]: "wi-cloudy",
    [WeatherCondition.foggy]: "wi-fog",
    [WeatherCondition.haze]: "wi-smog",
    [WeatherCondition.mostlyClear]: "wi-day-sunny-overcast",
    [WeatherCondition.mostlyCloudy]: "wi-day-cloudy-high",
    [WeatherCondition.partlyCloudy]: "wi-day-cloudy",
    [WeatherCondition.smoky]: "wi-fire",
    [WeatherCondition.breezy]: "wi-day-light-wind",
    [WeatherCondition.windy]: "wi-windy",
    [WeatherCondition.drizzle]: "wi-day-sprinkle",
    [WeatherCondition.heavyRain]: "wi-raindrops",
    [WeatherCondition.isolatedThunderstorms]: "wi-day-thunderstorm",
    [WeatherCondition.rain]: "wi-raindrop",
    [WeatherCondition.sunShowers]: "wi-day-rain-mix",
    [WeatherCondition.scatteredThunderstorms]: "wi-day-thunderstorm",
    [WeatherCondition.strongStorms]: "wi-day-storm-showers",
    [WeatherCondition.thunderstorms]: "wi-day-thunderstorm",
    [WeatherCondition.frigid]: "wi-day-cloudy-gusts",
    [WeatherCondition.hail]: "wi-hail",
    [WeatherCondition.hot]: "wi-hot",
    [WeatherCondition.flurries]: "wi-day-snow",
    [WeatherCondition.sleet]: "wi-day-sleet",
    [WeatherCondition.snow]: "wi-snow",
    [WeatherCondition.sunFlurries]: "wi-day-snow-wind",
    [WeatherCondition.wintryMix]: "wi-rain-mix",
    [WeatherCondition.blizzard]: "wi-snow",
    [WeatherCondition.blowingSnow]: "wi-snow-wind",
    [WeatherCondition.freezingDrizzle]: "wi-day-rain-mix",
    [WeatherCondition.freezingRain]: "wi-day-rain-mix",
    [WeatherCondition.heavySnow]: "wi-snow",
    [WeatherCondition.hurricane]: "wi-hurricane",
    [WeatherCondition.tropicalStorm]: "wi-hurricane-warning",
}

export interface ConditionProps {
    readonly className?: string;
    readonly code: WeatherCondition;
}

export function Condition({className, code}: ConditionProps) {
    return (
        <span className={`${className ?? ''} wi ${codeClassNames[code]}`} alt={t(`forecast.weatherCondition.${code}`, { defaultValue: String(code) })} />
    );
}
