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

import { CurrentAirConditions } from "good-breathing/aqi";

export interface CurrentAirForecastProps {
    readonly conditions?: CurrentAirConditions;
}

export function CurrentAirForecast({ conditions }: CurrentAirForecastProps) {
    if (conditions === undefined) {
        return null;
    }
    return (
        <section className="current-air-forecast">
            <ol className="current-air-forecast-main">
            {conditions.indexes.map(index => (
                <li className="current-air-forecast-reading-group v-flow centered spacing">
                    <header className="current-air-forecast-reading name">
                        {index.displayName}
                    </header>
                    <div className="current-air-forecast-reading aqi unit hero" style={`color: ${index.color.cssColor};`}>
                        {index.aqiDisplay}
                    </div>
                    <footer className="current-air-forecast-reading category">
                        {index.category}
                    </footer>
                    <footer className="current-air-forecast-reading dominant-pollutant">
                        {index.dominantPollutant}
                    </footer>
                </li>
            ))}
            </ol>
            <footer className="recommendations">
                {conditions.healthRecommendations?.generalPopulation}
            </footer>
        </section>
    );
}
