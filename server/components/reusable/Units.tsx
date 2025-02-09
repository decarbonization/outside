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
import { formatAQI, formatCompassDirection, formatDepth, formatPercentage, formatPressure, formatSpeed, formatTemperature, formatUVIndex, formatVisibility } from "../../formatting/units";
import { useDeps } from "../../hooks/Deps";

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

function Empty({ className, autoHide = false }: UnitProps<undefined>) {
    if (autoHide) {
        return null;
    } else {
        const { i18n } = useDeps();
        return (
            <span className={classNames("unit", "empty", className)}>
                {i18n.t("units:placeholder")}
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
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "temperature", className)}>
            {formatTemperature(measurement, { i18n })}
        </span>
    );
}

export function TemperatureRangeUnit({ className, max, min, compact = true }: UnitRangeProps) {
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "unit-range", { compact })}>
            <div className="high">
                {i18n.t("units:highLabel")}<TemperatureUnit className={classNames("high", className)} measurement={max} />
            </div>
            <div className="low">
                {i18n.t("units:lowLabel")}<TemperatureUnit className={classNames("low", className)} measurement={min} />
            </div>
        </span>
    );
}

export function PercentageUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("percentage", className)} autoHide={autoHide} />
        );
    }
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "percentage", className)}>
            {formatPercentage(measurement, { i18n })}
        </span>
    );
}

export function UVIndexUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("uv-index", className)} autoHide={autoHide} />
        );
    }
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "uv-index", className)}>
            {formatUVIndex(measurement, { i18n })}
        </span>
    );
}

export function AQIUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("aqi", className)} autoHide={autoHide} />
        );
    }
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "aqi", className)}>
            {formatAQI(measurement, { i18n })}
        </span>
    );
}

export function VisibilityUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("visibility", className)} autoHide={autoHide} />
        );
    }
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "visibility", className)}>
            {formatVisibility(measurement, { i18n })}
        </span>
    );
}

export function PressureUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("pressure", className)} autoHide={autoHide} />
        );
    }
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "pressure", className)}>
            {formatPressure(measurement, { i18n })}
        </span>
    );
}

export function SpeedUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("speed", className)} autoHide={autoHide} />
        );
    }
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "speed", className)}>
            {formatSpeed(measurement, { i18n })}
        </span>
    );
}

export function DepthUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("depth", className)} autoHide={autoHide} />
        );
    }
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "depth", className)}>
            {formatDepth(measurement, { i18n })}
        </span>
    );
}

export function CompassDirectionUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className="compass-direction" autoHide={autoHide} />
        );
    }
    const { i18n } = useDeps();
    return (
        <span className={classNames("unit", "compass-direction", className)}>
            {formatCompassDirection(measurement, { i18n })}
        </span>
    );
}
