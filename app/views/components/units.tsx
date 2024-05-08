import classNames from "classnames";
import convert from "convert";
import i18next, { t } from "i18next";

export interface UnitProps<Measurement = number> {
    /**
     * Extra class names to apply to the element.
     */
    readonly className?: string;

    /**
     * The measurement to render.
     */
    readonly measurement?: Measurement;

    /**
     * Whether to hide the element if a `measurement` is not provided.
     */
    readonly autoHide?: boolean;
}

export interface UnitRangeProps<Measurement = number> {
    readonly className?: string;
    readonly max?: Measurement;
    readonly min?: Measurement;
    readonly compact?: boolean;
}

function usingUsCustomary(): boolean {
    const resolvedLanguage = i18next.resolvedLanguage;
    return resolvedLanguage === undefined
        || resolvedLanguage.endsWith("US");
}

function Empty({ className, autoHide = false }: UnitProps<undefined>) {
    if (autoHide) {
        return null;
    } else {
        return (
            <span className={classNames("unit", "empty", className)}>
                {t("units:placeholder")}
            </span>
        );
    }
}

export function TemperatureUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("temperature", className)} autoHide={autoHide} />
        );
    }
    const temperature = usingUsCustomary()
        ? t("units:fahrenheit", { value: convert(measurement, "celsius").to("fahrenheit") })
        : t("units:celsius", { value: measurement });
    return (
        <span className={classNames("unit", "temperature", className)}>
            {temperature}
        </span>
    );
}

export function TemperatureRangeUnit({ className, max, min, compact = true }: UnitRangeProps) {
    return (
        <span className="unit unit-range">
            {t("units:highLabel")}<TemperatureUnit className={className} measurement={max} />
            {compact ? <>&nbsp;</> : <br />}
            {t("units:lowLabel")}<TemperatureUnit className={className} measurement={min} />
        </span>
    );
}

export function PercentageUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("percentage", className)} autoHide={autoHide} />
        );
    }
    return (
        <span className={classNames("unit", "percentage", className)}>
            {t("units:percentage", { value: measurement })}
        </span>
    );
}

export function UVIndexUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("uv-index", className)} autoHide={autoHide} />
        );
    }
    return (
        <span className={classNames("unit", "uv-index", className)}>
            {t("units:uvIndex", { intensity: measurement })}
        </span>
    );
}

export function VisibilityUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("visibility", className)} autoHide={autoHide} />
        );
    }
    if (usingUsCustomary()) {
        if (measurement >= 160.934 /* one tenth of a mile */) {
            return (
                <span className={classNames("unit", "visibility", className)}>
                    {t("units:miles", { value: convert(measurement, "meters").to("miles") })}
                </span>
            );
        } else {
            return (
                <span className={classNames("unit", "visibility", className)}>
                    {t("units:feet", { value: convert(measurement, "meters").to("feet") })}
                </span>
            );
        }
    } else {
        if (measurement >= 1000) {
            return (
                <span className={classNames("unit", "visibility", className)}>
                    {t("units:kilometers", { value: convert(measurement, "meters").to("kilometers") })}
                </span>
            );
        } else {
            return (
                <span className={classNames("unit", "visibility", className)}>
                    {t("units:meters", { value: measurement })}
                </span>
            );
        }
    }
}

export function PressureUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("pressure", className)} autoHide={autoHide} />
        );
    }
    const pressure = usingUsCustomary()
        ? t("units:inHg", { value: measurement * 0.029529980 })
        : t("units:millibars", { value: measurement });
    return (
        <span className={classNames("unit", "pressure", className)}>
            {pressure}
        </span>
    );
}

export function SpeedUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("speed", className)} autoHide={autoHide} />
        );
    }
    const speed = usingUsCustomary()
        ? t("units:milesPerHour", { value: convert(measurement, "kilometers").to("miles") })
        : t("units:kilometersPerHour", { value: measurement });
    return (
        <span className={classNames("unit", "speed", className)}>
            {speed}
        </span>
    );
}

export function DepthUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("depth", className)} autoHide={autoHide} />
        );
    }
    const depth = usingUsCustomary()
        ? t("units:inches", { value: convert(measurement, "millimeters").to("inches") })
        : t("units:millimeters", { value: measurement });
    return (
        <span className={classNames("unit", "depth", className)}>
            {depth}
        </span>
    );
}

export function CompassDirectionUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className="compass-direction" autoHide={autoHide} />
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

export function TrendUnitLabel({ className, measurement }: UnitProps<'rising' | 'steady' | 'falling'>) {
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
