/*
 * outside weather app
 * Copyright (C) 2014  Peter "Kevin" Contreras
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { t } from "i18next";
import { WeatherCondition } from "../../../fruit-company/weather/models/base";
import classNames from "classnames";

const codeImageNames = {
    [WeatherCondition.blowingDust]: "dust-DAYNIGHT",
    [WeatherCondition.clear]: "clear-DAYNIGHT",
    [WeatherCondition.cloudy]: "cloudy",
    [WeatherCondition.foggy]: "fog-DAYNIGHT",
    [WeatherCondition.haze]: "haze-DAYNIGHT",
    [WeatherCondition.mostlyClear]: "partly-cloudy-DAYNIGHT",
    [WeatherCondition.mostlyCloudy]: "partly-cloudy-DAYNIGHT",
    [WeatherCondition.partlyCloudy]: "overcast-DAYNIGHT",
    [WeatherCondition.smoky]: "smoke",
    [WeatherCondition.breezy]: "windy",
    [WeatherCondition.windy]: "windy",
    [WeatherCondition.drizzle]: "drizzle",
    [WeatherCondition.heavyRain]: "raindrops",
    [WeatherCondition.isolatedThunderstorms]: "thunderstorms-DAYNIGHT",
    [WeatherCondition.rain]: "rain",
    [WeatherCondition.sunShowers]: "partly-cloudy-day-rain",
    [WeatherCondition.scatteredThunderstorms]: "thunderstorms-DAYNIGHT",
    [WeatherCondition.strongStorms]: "not-available",
    [WeatherCondition.thunderstorms]: "thunderstorms-DAYNIGHT",
    [WeatherCondition.frigid]: "thermometer-mercury-cold",
    [WeatherCondition.hail]: "hail",
    [WeatherCondition.hot]: "thermometer-mercury",
    [WeatherCondition.flurries]: "partly-cloudy-DAYNIGHT-snow",
    [WeatherCondition.sleet]: "sleet",
    [WeatherCondition.snow]: "snow",
    [WeatherCondition.sunFlurries]: "partly-cloudy-DAYNIGHT-rain",
    [WeatherCondition.wintryMix]: "hail",
    [WeatherCondition.blizzard]: "snow",
    [WeatherCondition.blowingSnow]: "snow",
    [WeatherCondition.freezingDrizzle]: "partly-cloudy-DAYNIGHT-sleet",
    [WeatherCondition.freezingRain]: "partly-cloudy-DAYNIGHT-sleet",
    [WeatherCondition.heavySnow]: "snow",
    [WeatherCondition.hurricane]: "hurricane",
    [WeatherCondition.tropicalStorm]: "hurricane",
};

export interface ConditionProps {
    readonly className?: string;
    readonly code: WeatherCondition;
    readonly daylight?: boolean;
}

export function Condition({ className, code, daylight = true }: ConditionProps) {
    return (
        <img className={classNames("condition", className)} src={srcFor(code, daylight)} alt={labelFor(code)} />
    );
}

function srcFor(code: WeatherCondition, daylight: boolean): string | undefined {
    const rawImageName = codeImageNames[code];
    if (rawImageName === undefined) {
        return undefined;
    }
    const imageName = daylight
        ? rawImageName.replace("DAYNIGHT", "day")
        : rawImageName.replace("DAYNIGHT", "night");
    return `/weather-icons/fill/${imageName}.svg`;
}

function labelFor(code: WeatherCondition): string {
    return t(`forecast.weatherCondition.${code}`, { defaultValue: code as string });
}
