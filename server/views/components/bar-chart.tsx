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

export interface BarChartProps {
    readonly className?: string;
    readonly min: number;
    readonly max: number;
    readonly values: number[];
    readonly captions: string[];
}

export function BarChart({ className, min, max, values, captions }: BarChartProps) {
    if (values.length === 0) {
        return null;
    }
    const maxWidthPerBar = ((1.0 / values.length) * 100.0).toFixed(2);
    const inlineStyle = `--bar-chart-item-width: ${maxWidthPerBar}%;`;
    return (
        <ol className={classNames("bar-chart", "orthogonal-scrollable", className)} style={inlineStyle}>
            {values.map((value, index) => (
                <Bar min={min} max={max} value={value} caption={captions[index]} />
            ))}
        </ol>
    );
}

interface BarProps {
    readonly min: number;
    readonly max: number;
    readonly value: number;
    readonly caption: string;
}

function Bar({ value, min, max, caption }: BarProps) {
    const normalizedValue = Math.max(min, Math.min(max, value));
    const percentage = 100 * (normalizedValue - min) / (max - min);
    const pNumber = Math.round(percentage / 10) * 10;
    return (
        <li className={classNames("bar-chart-item", `p${pNumber}`)} data-tooltip={caption} />
    );
}
