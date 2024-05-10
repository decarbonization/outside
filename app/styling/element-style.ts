import { WeatherCondition } from "../../fruit-company/weather/models/base";

export function elementStyleFor(code?: WeatherCondition, daylight?: boolean): string | undefined {
    switch (code) {
        case undefined:
            return undefined;
        
        case WeatherCondition.clear:
        case WeatherCondition.mostlyClear:
        case WeatherCondition.hot:
        case WeatherCondition.sunFlurries:
        case WeatherCondition.sunShowers:
        case WeatherCondition.breezy:
        case WeatherCondition.windy:
        case WeatherCondition.frigid:
            return resolve("clear", daylight);

        case WeatherCondition.cloudy:
        case WeatherCondition.foggy:
        case WeatherCondition.haze:
        case WeatherCondition.mostlyCloudy:
        case WeatherCondition.partlyCloudy:
            return resolve("overcast", daylight);

        case WeatherCondition.drizzle:
        case WeatherCondition.heavyRain:
        case WeatherCondition.isolatedThunderstorms:
        case WeatherCondition.rain:
        case WeatherCondition.scatteredThunderstorms:
        case WeatherCondition.thunderstorms:
        case WeatherCondition.hail:
        case WeatherCondition.flurries:
        case WeatherCondition.sleet:
        case WeatherCondition.snow:
        case WeatherCondition.wintryMix:
        case WeatherCondition.blowingSnow:
        case WeatherCondition.freezingDrizzle:
        case WeatherCondition.freezingRain:
            return resolve("precipitating", daylight);

        case WeatherCondition.strongStorms:
        case WeatherCondition.blizzard:
        case WeatherCondition.heavySnow:
        case WeatherCondition.hurricane:
        case WeatherCondition.tropicalStorm:
            return resolve("extreme", daylight);


        case WeatherCondition.blowingDust:
        case WeatherCondition.smoky:
            return resolve("unhealthy", daylight);
    }
}

function resolve(stylePart: string, daylight?: boolean): string {
    if (daylight) {
        return `day-${stylePart}`;
    } else {
        return `night-${stylePart}`;
    }
}
