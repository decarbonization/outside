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

import { Weather } from "fruit-company/weather";
import { CurrentAirConditions } from "good-breathing/aqi";
import { useRoute } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import { getCurrentAirConditions, getWeather } from "../api/fetches";
import AppFooter from "../components/AppFooter";
import NavigationBar from "../components/NavigationBar";
import CompleteForecast from "../components/weather/CompleteForecast";

export default function WeatherPage() {
    const { params: { country, latitude, longitude, locality } } = useRoute();
    const [weather, setWeather] = useState<Weather | undefined>(undefined);
    const [air, setAir] = useState<CurrentAirConditions | undefined>(undefined);
    useEffect(() => {
        if (import.meta.env.SSR) {
            return;
        }
        (async () => {
            console.log(`Fetching weather for ${country} ${latitude} ${longitude}`);
            const [weather, air] = await Promise.all([
                getWeather(country, latitude, longitude),
                getCurrentAirConditions(country, latitude, longitude),
            ]);
            setWeather(weather);
            setAir(air);
        })();
    }, [country, latitude, longitude, setWeather, setAir]);

    return (
        <>
            <NavigationBar searchQuery={locality} />
            <main>
                <CompleteForecast weather={weather} air={air} />
            </main>
            <AppFooter />
        </>
    );
}
