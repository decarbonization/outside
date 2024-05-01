import { CurrentWeather } from "./current-weather";
import { DailyForecast } from "./daily-forecast";
import { HourlyForecast } from "./hourly-forecast";
import { NextHourForecast } from "./next-hour-forecast";
import { WeatherAlertCollection } from "./weather-alert-collection";

export interface Weather {
    /**
     * The current weather for the requested location.
     */
    readonly currentWeather?: CurrentWeather;

    /**
     * The daily forecast for the requested location.
     */
    readonly forecastDaily?: DailyForecast;

    /**
     * The hourly forecast for the requested location.
     */
    readonly forecastHourly?: HourlyForecast;

    /**
     * The next hour forecast for the requested location.
     */
    readonly forecastNextHour?: NextHourForecast;

    /**
     * Weather alerts for the requested location.
     */
    readonly weatherAlerts?: WeatherAlertCollection;
}
