import { t } from "i18next";
import { WeatherCondition } from "../../../fruit-company/weather/models/base";
import classNames from "classnames";

const codeClassNames = {
    [WeatherCondition.blowingDust]: "wi-dust",
    [WeatherCondition.clear]: "wi-DAYNIGHT-sunny",
    [WeatherCondition.cloudy]: "wi-cloudy",
    [WeatherCondition.foggy]: "wi-fog",
    [WeatherCondition.haze]: "wi-smog",
    [WeatherCondition.mostlyClear]: "wi-DAYNIGHT-sunny-overcast",
    [WeatherCondition.mostlyCloudy]: "wi-DAYNIGHT-cloudy-high",
    [WeatherCondition.partlyCloudy]: "wi-DAYNIGHT-cloudy",
    [WeatherCondition.smoky]: "wi-fire",
    [WeatherCondition.breezy]: "wi-DAYNIGHT-light-wind",
    [WeatherCondition.windy]: "wi-windy",
    [WeatherCondition.drizzle]: "wi-DAYNIGHT-sprinkle",
    [WeatherCondition.heavyRain]: "wi-raindrops",
    [WeatherCondition.isolatedThunderstorms]: "wi-DAYNIGHT-thunderstorm",
    [WeatherCondition.rain]: "wi-raindrop",
    [WeatherCondition.sunShowers]: "wi-DAYNIGHT-rain-mix",
    [WeatherCondition.scatteredThunderstorms]: "wi-DAYNIGHT-thunderstorm",
    [WeatherCondition.strongStorms]: "wi-DAYNIGHT-storm-showers",
    [WeatherCondition.thunderstorms]: "wi-DAYNIGHT-thunderstorm",
    [WeatherCondition.frigid]: "wi-DAYNIGHT-cloudy-gusts",
    [WeatherCondition.hail]: "wi-hail",
    [WeatherCondition.hot]: "wi-hot",
    [WeatherCondition.flurries]: "wi-DAYNIGHT-snow",
    [WeatherCondition.sleet]: "wi-DAYNIGHT-sleet",
    [WeatherCondition.snow]: "wi-snow",
    [WeatherCondition.sunFlurries]: "wi-DAYNIGHT-snow-wind",
    [WeatherCondition.wintryMix]: "wi-rain-mix",
    [WeatherCondition.blizzard]: "wi-snow",
    [WeatherCondition.blowingSnow]: "wi-snow-wind",
    [WeatherCondition.freezingDrizzle]: "wi-DAYNIGHT-rain-mix",
    [WeatherCondition.freezingRain]: "wi-DAYNIGHT-rain-mix",
    [WeatherCondition.heavySnow]: "wi-snow",
    [WeatherCondition.hurricane]: "wi-hurricane",
    [WeatherCondition.tropicalStorm]: "wi-hurricane-warning",
};

export interface ConditionProps {
    readonly className?: string;
    readonly code: WeatherCondition;
    readonly daylight?: boolean;
}

export function Condition({ className, code, daylight = true }: ConditionProps) {
    return (
        <span className={classNames(className, "wi", classNameFor(code, daylight))} alt={labelFor(code)} />
    );
}

function classNameFor(code: WeatherCondition, daylight: boolean): string | undefined {
    const className = codeClassNames[code];
    if (className === undefined) {
        return undefined;
    }
    if (daylight) {
        return className.replace("DAYNIGHT", "day");
    } else {
        return className.replace("DAYNIGHT", "night");
    }
}

function labelFor(code: WeatherCondition): string {
    return t(`forecast.weatherCondition.${code}`, { defaultValue: code as string });
}
