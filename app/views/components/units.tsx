import convert from "convert";
import i18next, { t } from "i18next";

export interface UnitProps<Measurement = number> {
    readonly className?: string;
    readonly measurement?: Measurement;
}

export interface UnitRangeProps<Measurement = number> {
    readonly className?: string;
    readonly max?: Measurement;
    readonly min?: Measurement;
}

function usingUsCustomary(): boolean {
    const resolvedLanguage = i18next.resolvedLanguage;
    return resolvedLanguage === undefined
        || resolvedLanguage.endsWith("US");
}

export function TemperatureUnit({ className, measurement }: UnitProps) {
    if (measurement === undefined) {
        return (
            <span className={`unit temperature empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }
    const temperature = usingUsCustomary()
        ? t("units:fahrenheit", { value: convert(measurement, "celsius").to("fahrenheit") })
        : t("units:celsius", { value: measurement });
    return (
        <span className={`unit temperature ${className ?? ''}`}>
            {temperature}
        </span>
    );
}

export function TemperatureRangeUnit({ className, max, min }: UnitRangeProps) {
    return (
        <span className="unit unit-range">
            {t("units:highLabel")}<TemperatureUnit className={className} measurement={max} />
            &nbsp;
            {t("units:lowLabel")}<TemperatureUnit className={className} measurement={min} />
        </span>
    );
}

export function PercentageUnit({ className, measurement }: UnitProps) {
    if (measurement === undefined) {
        return (
            <span className={`unit percentage empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }
    return (
        <span className={`unit percentage ${className ?? ''}`}>
            {t("units:percentage", { value: measurement })}
        </span>
    );
}

export function UVIndexUnit({ className, measurement }: UnitProps) {
    if (measurement === undefined) {
        return (
            <span className={`unit uv-index empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }

    return (
        <span className="unit uv-index">
            {t("units:uvIndex", { intensity: measurement })}
        </span>
    );
}

export function VisibilityUnit({ className, measurement }: UnitProps) {
    if (measurement === undefined) {
        return (
            <span className={`unit visibility empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }
    if (usingUsCustomary()) {
        if (measurement >= 160.934 /* one tenth of a mile */) {
            return (
                <span className={`unit visibility ${className ?? ''}`}>
                    {t("units:miles", { value: convert(measurement, "meters").to("miles") })}
                </span>
            );
        } else {
            return (
                <span className={`unit visibility ${className ?? ''}`}>
                    {t("units:feet", { value: convert(measurement, "meters").to("feet") })}
                </span>
            );
        }
    } else {
        if (measurement >= 1000) {
            return (
                <span className={`unit visibility ${className ?? ''}`}>
                    {t("units:kilometers", { value: convert(measurement, "meters").to("kilometers") })}
                </span>
            );
        } else {
            return (
                <span className={`unit visibility ${className ?? ''}`}>
                    {t("units:meters", { value: measurement })}
                </span>
            );
        }
    }
}

export function PressureUnit({ className, measurement }: UnitProps) {
    if (measurement === undefined) {
        return (
            <span className={`unit pressure empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }
    const temperature = usingUsCustomary()
        ? t("units:inHg", { value: measurement * 0.029529980 })
        : t("units:millibars", { value: measurement });
    return (
        <span className={`unit pressure ${className ?? ''}`}>
            {temperature}
        </span>
    );
}

export function SpeedUnit({ className, measurement }: UnitProps) {
    if (measurement === undefined) {
        return (
            <span className={`unit speed empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }
    const temperature = usingUsCustomary()
        ? t("units:milesPerHour", { value: convert(measurement, "kilometers").to("miles") })
        : t("units:kilometersPerHour", { value: measurement });
    return (
        <span className={`unit speed ${className ?? ''}`}>
            {temperature}
        </span>
    );
}

export function CompassDirectionUnit({ className, measurement }: UnitProps) {
    if (measurement === undefined) {
        return (
            <span className={`unit compass-direction empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }

    let iconName: string;
    if (measurement === 0 || (measurement > 270 && measurement <= 360)) {
        iconName = "wi-towards-n";
    } else if (measurement > 0 && measurement < 90) {
        iconName = "wi-towards-ne";
    } else if (measurement === 90) {
        iconName = "wi-towards-e";
    } else if (measurement > 90 && measurement < 180) {
        iconName = "wi-towards-se";
    } else if (measurement === 180) {
        iconName = "wi-towards-s";
    } else if (measurement > 180 && measurement < 270) {
        iconName = "wi-towards-sw";
    } else if (measurement === 270) {
        iconName = "wi-towards-w";
    } else {
        throw new RangeError(`<${measurement}> is not a valid compass reading`);
    }
    return (
        <span className={`unit compass-direction ${className ?? ''} wi wi-wind ${iconName}`}></span>
    );
}
export function TrendUnitLabel({className, measurement}: UnitProps<'rising' | 'steady' | 'falling'>) {
    switch (measurement) {
        case 'rising':
            return (
                <span className={`wi wi-direction-up ${className ?? ""}`} />
            );
        case 'steady':
            return null;
        case 'falling':
            return (
                <span className={`wi wi-direction-down ${className ?? ""}`} />
            );
        default:
            return null;
    }
}