import convert from "convert";
import i18next from "i18next";
import { I18next } from "i18next-http-middleware";

export const enum UnitSystem {
    metric = "metric",
    usCustomary = "usCustomary",
}

function defaultUnitSystem(i18n: I18next): UnitSystem {
    const resolvedLanguage = i18n.resolvedLanguage;
    if (resolvedLanguage === undefined || resolvedLanguage.endsWith("US")) {
        return UnitSystem.usCustomary;
    } else {
        return UnitSystem.metric
    }
}

export interface UnitOptions {
    readonly i18n?: I18next;
    readonly system?: UnitSystem;
}

export function formatTemperature(measurement: number, { i18n = i18next, system = defaultUnitSystem(i18n) }: UnitOptions = {}): string {
    switch (system) {
        case UnitSystem.metric:
            return i18n.t("units:celsius", { value: measurement });
        case UnitSystem.usCustomary:
            return i18n.t("units:fahrenheit", { value: convert(measurement, "celsius").to("fahrenheit") });
    }
}

export function formatPercentage(measurement: number, { i18n = i18next }: UnitOptions = {}): string {
    return i18n.t("units:percentage", { value: measurement });
}

export function formatUVIndex(measurement: number, { i18n = i18next }: UnitOptions = {}): string {
    return i18n.t("units:uvIndex", { intensity: measurement });
}

export function formatVisibility(measurement: number, { i18n = i18next, system = defaultUnitSystem(i18n) }: UnitOptions = {}): string {
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

export function formatPressure(measurement: number, { i18n = i18next, system = defaultUnitSystem(i18n) }: UnitOptions = {}): string {
    switch (system) {
        case UnitSystem.metric:
            return i18n.t("units:millibars", { value: measurement });
        case UnitSystem.usCustomary:
            return i18n.t("units:inHg", { value: measurement * 0.029529980 });
    }
}

export function formatSpeed(measurement: number, { i18n = i18next, system = defaultUnitSystem(i18n) }: UnitOptions = {}): string {
    switch (system) {
        case UnitSystem.metric:
            return i18n.t("units:kilometersPerHour", { value: measurement });
        case UnitSystem.usCustomary:
            return i18n.t("units:milesPerHour", { value: convert(measurement, "kilometers").to("miles") });
    }
}

export function formatDepth(measurement: number, { i18n = i18next, system = defaultUnitSystem(i18n) }: UnitOptions = {}): string {
    switch (system) {
        case UnitSystem.metric:
            return i18n.t("units:millimeters", { value: measurement });
        case UnitSystem.usCustomary:
            return i18n.t("units:inches", { value: convert(measurement, "millimeters").to("inches") });
    }
}

export function formatCompassDirection(measurement: number, { i18n = i18next }: UnitOptions = {}): string {
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
