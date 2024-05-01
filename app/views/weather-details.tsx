import { Weather } from "../../fruitkit/apple-weather/models/weather";
import { DailyForecast } from "./daily-forecast";
import { HourlyForecast } from "./hourly-forecast";
import { WeatherConditions } from "./weather-conditions";

export interface WeatherDetailsProps {
    readonly location?: string;
    readonly weather?: Weather;
}

export function WeatherDetails({location, weather}: WeatherDetailsProps) {
    return (
        <>
            <h1>{location}</h1>
            <WeatherConditions now={weather?.currentWeather} forecast={weather?.forecastDaily?.days?.[0]} />
            <HourlyForecast forecast={weather?.forecastHourly} />
            <DailyForecast forecast={weather?.forecastDaily} />
        </>
    );
}