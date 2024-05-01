import { PrecipitationType, PressureTrend, ProductData, WeatherCondition } from "./base";

/**
 * The hourly forecast information.
 */
export interface HourlyForecast extends ProductData {
    /**
     * An array of hourly forecasts.
     */
    readonly hours: HourWeatherConditions[];
}

/**
 * The historical or forecasted weather conditions for a specified hour.
 */
export interface HourWeatherConditions {
    /**
     * The percentage of the sky covered with clouds during the period, from 0 to 1.
     */
    readonly cloudCover: number;
    
    /**
     * An enumeration value indicating the condition at the time.
     */
    readonly conditionCode: WeatherCondition;
    
    /**
     * Indicates whether the hour starts during the day or night.
     */
    readonly daylight?: boolean;

    /**
     * The starting date and time of the forecast.
     */
    readonly forecastStart: Date;

    /**
     * The relative humidity at the start of the hour, from 0 to 1.
     */
    readonly humidity: number;

    /**
     * The chance of precipitation forecasted to occur during the hour, from 0 to 1.
     */
    readonly precipitationChance: number;

    /**
     * The type of precipitation forecasted to occur during the period.
     */
    readonly precipitationType: PrecipitationType;
    
    /**
     * The sea-level air pressure, in millibars.
     */
    readonly pressure: number;
    
    /**
     * The direction of change of the sea-level air pressure.
     */
    readonly pressureTrend?: PressureTrend;

    /**
     * The rate at which snow crystals are falling, in millimeters per hour.
     */
    readonly snowfallIntensity?: number;

    /**
     * The temperature at the start of the hour, in degrees Celsius.
     */
    readonly temperature: number;
    
    /**
     * The feels-like temperature when considering wind and humidity, at the start of the hour, in degrees Celsius.
     */
    readonly temperatureApparent: number;

    /**
     * The temperature at which relative humidity is 100% at the top of the hour, in degrees Celsius.
     */
    readonly temperatureDewPoint?: number;

    /**
     * The level of ultraviolet radiation at the start of the hour.
     */
    readonly uvIndex: number;

    /**
     * The distance at which terrain is visible at the start of the hour, in meters.
     */
    readonly visibility: number;

    /**
     * The direction of the wind at the start of the hour, in degrees.
     */
    readonly windDirection?: number;

    /**
     * The maximum wind gust speed during the hour, in kilometers per hour.
     */
    readonly windGust?: number;

    /**
     * The wind speed at the start of the hour, in kilometers per hour.
     */
    readonly windSpeed: number;

    /**
     * The amount of precipitation forecasted to occur during period, in millimeters.
     */
    readonly precipitationAmount?: number;
}
