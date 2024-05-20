import { Weather } from "../../fruit-company/weather/models/weather";
import { elementStyleFor } from "../styling/element-style";
import { DepsObject } from "../views/_deps";
import { PlaceSearch } from "../views/place-search";
import { WeatherDetails } from "../views/weather-details";
import { renderApp } from "./_app";

export interface RenderWeatherOptions {
    readonly deps: DepsObject;
    readonly query?: string;
    readonly weather: Weather;
}

export function renderWeather({ deps, query, weather }: RenderWeatherOptions): string {
    const className = elementStyleFor(weather.currentWeather?.conditionCode, weather.currentWeather?.daylight);
    return renderApp({ className, deps }, (
        <>
            <PlaceSearch query={query} />
            <WeatherDetails weather={weather} />
        </>
    ));
}
