import { PressureTrend, ProductData, WeatherCondition } from "./base";

/**
 * The current weather conditions for the specified location.
 */
export interface CurrentWeather extends ProductData {
    /**
     * The date and time.
     */
    readonly asOf: Date;

    /**
     * The percentage of the sky covered with clouds during the period, from 0 to 1.
     */
    readonly cloudCover?: number;

    /**
     * An enumeration value indicating the condition at the time.
     */
    readonly conditionCode: WeatherCondition;

    /**
     * A Boolean value indicating whether there is daylight.
     */
    readonly daylight?: boolean;

    /**
     * The relative humidity, from 0 to 1.
     */
    readonly humidity: number;

    /**
     * The precipitation intensity, in millimeters per hour.
     */
    readonly precipitationIntensity: number;

    /**
     * The sea level air pressure, in millibars.
     */
    readonly pressure: number;

    /**
     * The direction of change of the sea-level air pressure.
     */
    readonly pressureTrend: PressureTrend;

    /**
     * The current temperature, in degrees Celsius.
     */
    readonly temperature: number;

    /**
     * The feels-like temperature when factoring wind and humidity, in degrees Celsius.
     */
    readonly temperatureApparent: number;

    /**
     * The temperature at which relative humidity is 100%, in Celsius.
     */
    readonly temperatureDewPoint: number;

    /**
     * The level of ultraviolet radiation.
     */
    readonly uvIndex: number;

    /**
     * The distance at which terrain is visible, in meters.
     */
    readonly visibility: number;

    /**
     * The direction of the wind, in degrees.
     */
    readonly windDirection?: number;

    /**
     * The maximum wind gust speed, in kilometers per hour.
     */
    readonly windGust?: number;

    /**
     * The wind speed, in kilometers per hour.
     */
    readonly windSpeed: number;
}
