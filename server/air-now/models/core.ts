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

export const enum AqiCategory {
    good = 1,
    moderate = 2,
    unhealthyForSensitiveGroups = 3,
    unhealthy = 4,
    veryUnhealthy = 5,
    hazardous = 6,
    unavailable = 7,
}

export const enum AqiReadingType {
    ozone = "O3",
    fineParticles = "PM2.5",
    coarseParticles = "PM10",
}

export interface AqiReading {
    readonly type: AqiReadingType;
    readonly category: AqiCategory;
    readonly aqi: number;
}
