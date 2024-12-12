/*
 * outside weather app
 * Copyright (C) 2024  MAINTAINERS
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

import classNames from "classnames";
import { WeatherCondition } from "fruit-company/weather";
import { weatherConditionFragment } from "../../formatting/fragments";
import { icon, IconPack } from "../../styling/icon-pack";
import { useDeps } from "../_deps";

const conditionIcons: IconPack<WeatherCondition> = {
    "base": {
        "day": "wi fill day",
        "night": "wi fill night"
    },
    "BlowingDust": "dust",
    "Clear": {
        "day": "clear-day",
        "night": "clear-night"
    },
    "Cloudy": "cloudy",
    "Foggy": {
        "day": "fog-day",
        "night": "fog-night"
    },
    "Haze": {
        "day": "haze-day",
        "night": "haze-night"
    },
    "MostlyClear": {
        "day": "partly-cloudy-day",
        "night": "partly-cloudy-night"
    },
    "MostlyCloudy": {
        "day": "partly-cloudy-day",
        "night": "partly-cloudy-night"
    },
    "PartlyCloudy": {
        "day": "partly-cloudy-day",
        "night": "partly-cloudy-night"
    },
    "Smoky": {
        "day": "partly-cloudy-day-smoke",
        "night": "partly-cloudy-night-smoke"
    },
    "Breezy": "wind",
    "Windy": "wind",
    "Drizzle": "drizzle",
    "HeavyRain": "raindrops",
    "IsolatedThunderstorms": {
        "day": "thunderstorms-day-rain",
        "night": "thunderstorms-night-rain"
    },
    "Rain": "rain",
    "SunShowers": {
        "day": "partly-cloudy-day-rain",
        "night": "partly-cloudy-night-rain"
    },
    "ScatteredThunderstorms": {
        "day": "thunderstorms-day-rain",
        "night": "thunderstorms-night-rain"
    },
    "StrongStorms": "raindrops",
    "Thunderstorms": {
        "day": "thunderstorms-day-rain",
        "night": "thunderstorms-night-rain"
    },
    "Frigid": "thermometer-mercury-cold",
    "Hail": "hail",
    "Hot": "thermometer-mercury",
    "Flurries": {
        "day": "partly-cloudy-day-snow",
        "night": "partly-cloudy-night-snow"
    },
    "Sleet": "sleet",
    "Snow": "snow",
    "SunFlurries": {
        "day": "partly-cloudy-day-snow",
        "night": "partly-cloudy-night-snow"
    },
    "WintryMix": "snow",
    "Blizzard": "snow",
    "BlowingSnow": "snow",
    "FreezingDrizzle": "rain",
    "FreezingRain": "rain",
    "HeavySnow": "snow",
    "Hurricane": "hurricane",
    "TropicalStorm": "hurricane",
};

export interface ConditionProps {
    readonly className?: string;
    readonly code: WeatherCondition;
    readonly daylight?: boolean;
}

export function Condition({ className, code, daylight = true }: ConditionProps) {
    const { i18n } = useDeps();
    return (
        <span className={classNames("icon", className, icon(conditionIcons, { name: code, daylight }))} aria-label={weatherConditionFragment(code, { i18n })} />
    );
}
