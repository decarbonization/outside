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

import { DepthUnit, PercentageUnit } from "./Units";

export interface PrecipitationProps {
    readonly probability: number;
    readonly amount?: number;
    readonly hideAutomatically?: boolean;
}

export default function Precipitation({ probability, amount, hideAutomatically = true }: PrecipitationProps) {
    if (probability === 0 && hideAutomatically) {
        return null;
    }
    if (amount !== undefined) {
        return (
            <span>
                <PercentageUnit measurement={probability} /> <DepthUnit measurement={amount} />
            </span>
        );
    } else {
        return (
            <PercentageUnit measurement={probability} />
        );
    }
}
