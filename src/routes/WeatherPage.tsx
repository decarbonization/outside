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

import { useRoute } from "preact-iso";
import { getCurrentAirConditions, getWeather } from "../api/fetches";
import AppFooter from "../components/AppFooter";
import NavigationBar from "../components/NavigationBar";
import CompleteForecast from "../components/weather/CompleteForecast";
import useFetch from "../hooks/Fetch";

export default function WeatherPage() {
    const { params: { country, latitude, longitude, locality } } = useRoute();
    
    const { data: weather } = useFetch({
        isEnabled: !import.meta.env.SSR,
        fetchKey: ["getWeather", country, latitude, longitude],
        fetchFn: () => getWeather(country, latitude, longitude),
    });
    
    const { data: air } = useFetch({
        isEnabled: !import.meta.env.SSR,
        fetchKey: ["getCurrentAirConditions", country, latitude, longitude],
        fetchFn: () => getCurrentAirConditions(country, latitude, longitude),
    });

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
