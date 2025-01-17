/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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

import convert from "convert";
import { i18n } from "i18next";

export const enum UnitSystem {
    metric = "metric",
    usCustomary = "usCustomary",
}

function defaultUnitSystem(i18n: i18n): UnitSystem {
    const resolvedLanguage = i18n.resolvedLanguage;
    if (resolvedLanguage === undefined || resolvedLanguage.endsWith("US")) {
        return UnitSystem.usCustomary;
    } else {
        return UnitSystem.metric
    }
}

export interface UnitOptions {
    readonly i18n: i18n;
    readonly system?: UnitSystem;
}

export function formatTemperature(measurement: number, { i18n, system = defaultUnitSystem(i18n) }: UnitOptions): string {
    switch (system) {
        case UnitSystem.metric:
            return i18n.t("units:celsius", { value: measurement });
        case UnitSystem.usCustomary:
            return i18n.t("units:fahrenheit", { value: convert(measurement, "celsius").to("fahrenheit") });
    }
}

export function formatPercentage(measurement: number, { i18n }: UnitOptions): string {
    return i18n.t("units:percentage", { value: measurement });
}

export function formatUVIndex(measurement: number, { i18n }: UnitOptions): string {
    return i18n.t("units:uvIndex", { value: measurement });
}

export function formatAQI(measurement: number, { i18n }: UnitOptions): string {
    return i18n.t("units:aqi", { value: measurement });
}

export function formatVisibility(measurement: number, { i18n, system = defaultUnitSystem(i18n) }: UnitOptions): string {
    switch (system) {
        case UnitSystem.metric:
            if (measurement >= 1000) {
                return i18n.t("units:kilometers", { value: convert(measurement, "meters").to("kilometers") });
            } else {
                return i18n.t("units:meters", { value: measurement });
            }
        case UnitSystem.usCustomary:
            if (measurement >= 160.934 /* one tenth of a mile */) {
                return i18n.t("units:miles", { value: convert(measurement, "meters").to("miles") });
            } else {
                return i18n.t("units:feet", { value: convert(measurement, "meters").to("feet") });
            }
    }
}

export function formatPressure(measurement: number, { i18n, system = defaultUnitSystem(i18n) }: UnitOptions): string {
    switch (system) {
        case UnitSystem.metric:
            return i18n.t("units:millibars", { value: measurement });
        case UnitSystem.usCustomary:
            return i18n.t("units:inHg", { value: measurement * 0.029529980 });
    }
}

export function formatSpeed(measurement: number, { i18n, system = defaultUnitSystem(i18n) }: UnitOptions): string {
    switch (system) {
        case UnitSystem.metric:
            return i18n.t("units:kilometersPerHour", { value: measurement });
        case UnitSystem.usCustomary:
            return i18n.t("units:milesPerHour", { value: convert(measurement, "kilometers").to("miles") });
    }
}

export function formatDepth(measurement: number, { i18n, system = defaultUnitSystem(i18n) }: UnitOptions): string {
    switch (system) {
        case UnitSystem.metric:
            return i18n.t("units:millimeters", { value: measurement });
        case UnitSystem.usCustomary:
            return i18n.t("units:inches", { value: convert(measurement, "millimeters").to("inches") });
    }
}

export function formatCompassDirection(measurement: number, { i18n, system = defaultUnitSystem(i18n) }: UnitOptions): string {
    let labelKey: string;
    if (measurement === 0) {
        labelKey = "north";
    } else if (measurement > 0 && measurement < 90) {
        labelKey = "northEast";
    } else if (measurement === 90) {
        labelKey = "east";
    } else if (measurement > 90 && measurement < 180) {
        labelKey = "southEast";
    } else if (measurement === 180) {
        labelKey = "south";
    } else if (measurement > 180 && measurement < 270) {
        labelKey = "southWest";
    } else if (measurement === 270) {
        labelKey = "west";
    } else if (measurement > 270 && measurement <= 360) {
        labelKey = "northWest";
    } else {
        throw new RangeError(`<${measurement}> is not a valid compass reading`);
    }
    return i18n.t(`units:compassDirection.${labelKey}`);
}
