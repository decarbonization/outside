import { PrecipitationType, ProductData } from "./base";

/**
 * The next hour forecast information.
 */
export interface NextHourForecast extends ProductData {
    /**
     * The time the forecast ends.
     */
    readonly forecastEnd?: Date;

    /**
     * The time the forecast starts.
     */
    readonly forecastStart?: Date;

    /**
     * An array of the forecast minutes.
     */
    readonly minutes: ForecastMinute[];

    /**
     * An array of the forecast summaries.
     */
    readonly summary: ForecastPeriodSummary[];
}

/**
 * The precipitation forecast for a specified minute.
 */
export interface ForecastMinute {
    /**
     * The probability of precipitation during this minute.
     */
    readonly precipitationChance: number;

    /** 
     * The precipitation intensity in millimeters per hour.
     */
    readonly precipitationIntensity: number;

    /**
     * The start time of the minute.
     */
    readonly startTime: Date;
}

/**
 * The summary for a specified period in the minute forecast.
 */
export interface ForecastPeriodSummary {
    /** 
     * The type of precipitation forecasted.
     */
    readonly condition: PrecipitationType;

    /** 
     * The end time of the forecast.
     */
    readonly endTime?: Date;

    /** 
     * The probability of precipitation during this period.
     */
    readonly precipitationChance: number;

    /** 
     * The precipitation intensity in millimeters per hour.
     */
    readonly precipitationIntensity: number;

    /** 
     * The start time of the forecast.
     */
    readonly startTime: Date;
}
