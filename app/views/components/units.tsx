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

import classNames from "classnames";
import { t } from "i18next";
import { uvIndexRiskFrom } from "../../../fruit-company/weather/models/base";
import { formatCompassDirection, formatDepth, formatPercentage, formatPressure, formatSpeed, formatTemperature, formatUVIndex, formatVisibility } from "../../formatting/units";

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
    return (
        <span className={classNames("unit", "temperature", className)}>
            {formatTemperature(measurement)}
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
            {formatPercentage(measurement)}
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
            {formatUVIndex(measurement)}&nbsp;{t(`forecast.uvIndexRisk.${uvIndexRiskFrom(measurement)}`)}
        </span>
    );
}

export function VisibilityUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("visibility", className)} autoHide={autoHide} />
        );
    }
    return (
        <span className={classNames("unit", "visibility", className)}>
            {formatVisibility(measurement)}
        </span>
    );
}

export function PressureUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("pressure", className)} autoHide={autoHide} />
        );
    }
    return (
        <span className={classNames("unit", "pressure", className)}>
            {formatPressure(measurement)}
        </span>
    );
}

export function SpeedUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("speed", className)} autoHide={autoHide} />
        );
    }
    return (
        <span className={classNames("unit", "speed", className)}>
            {formatSpeed(measurement)}
        </span>
    );
}

export function DepthUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className={classNames("depth", className)} autoHide={autoHide} />
        );
    }
    return (
        <span className={classNames("unit", "depth", className)}>
            {formatDepth(measurement)}
        </span>
    );
}

export function CompassDirectionUnit({ className, measurement, autoHide }: UnitProps) {
    if (measurement === undefined) {
        return (
            <Empty className="compass-direction" autoHide={autoHide} />
        );
    }
    return (
        <span className={classNames("unit", "compass-direction", className)}>
            {formatCompassDirection(measurement)}
        </span>
    );
}

export function TrendUnitLabel({ className, measurement }: UnitProps<'rising' | 'steady' | 'falling'>) {
    switch (measurement) {
        case 'rising':
            return (
                <span className={classNames("wi", "wi-direction-up", className)} />
            );
        case 'steady':
            return null;
        case 'falling':
            return (
                <span className={classNames("wi", "wi-direction-down", className)} />
            );
        default:
            return null;
    }
}
