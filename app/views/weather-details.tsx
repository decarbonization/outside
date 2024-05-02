import { Weather } from "../../fruit-company/weather/models/weather";
import { DailyForecast } from "./daily-forecast";
import { HourlyForecast } from "./hourly-forecast";
import { CurrentForecast } from "./current-forecast";

export interface WeatherDetailsProps {
    readonly weather?: Weather;
}

export function WeatherDetails({weather}: WeatherDetailsProps) {
    return (
        <>
            <CurrentForecast now={weather?.currentWeather} today={weather?.forecastDaily?.days?.[0]} />
            <HourlyForecast forecast={weather?.forecastHourly} />
            <DailyForecast forecast={weather?.forecastDaily} />
        </>
    );
}