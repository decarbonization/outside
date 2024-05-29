/**
 * An object that describes a location in terms of its longitude and latitude.
 */
export interface LocationCoordinates {
    /**
     * A double value that describes the latitude of the coordinate.
     */
    readonly latitude: number;

    /**
     * A double value that describes the longitude of the coordinate.
     */
    readonly longitude: number;
}

/**
 * Reduce the accuracy of the given geographic location.
 * 
 * @param location The location to reduce the accuracy of.
 * @param precision The maximum number of digits to the right 
 * of the decimal point to retain on the latitude and longitude. 
 * @returns New geographic coordinates.
 */
export function truncateLocationCoordinates(location: LocationCoordinates, precision: number): LocationCoordinates {
    const scale = Math.pow(10, precision);
    return {
        latitude: (Math.floor(location.latitude * scale) / scale),
        longitude: (Math.floor(location.longitude * scale) / scale),
    };
}

/**
 * Convert the given geographic location coordinates into 
 * a string which is suitable for use as part of a URL.
 * 
 * @param location The location to convert.
 * @returns A representation of the location which can be passed as part of a URL.
 */
export function urlLocationCoordinates(location: LocationCoordinates): string {
    return `${location.latitude},${location.longitude}`;
}

/**
 * An object that describes a map region in terms of its upper-right and lower-left corners as a pair of geographic points.
 */
export interface MapRegion {
    /**
     * A double value that describes the east longitude of the map region.
     */
    readonly eastLongitude: number;

    /**
     * A double value that describes the north latitude of the map region.
     */
    readonly northLatitude: number;

    /**
     * A double value that describes the south latitude of the map region.
     */
    readonly southLatitude: number;

    /**
     * A double value that describes west longitude of the map region.
     */
    readonly westLongitude: number;
}

/**
 * An object that describes the detailed address components of a place.
 */
export interface StructuredAddress {
    /**
     * The state or province of the place.
     */
    readonly administrativeArea: string;

    /**
     * The short code for the state or area.
     */
    readonly administrativeAreaCode: string;

    /**
     * Common names of the area in which the place resides.
     */
    readonly areasOfInterest: string[];

    /**
     * Common names for the local area or neighborhood of the place.
     */
    readonly dependentLocalities: string[];

    /**
     * A combination of thoroughfare and subthoroughfare.
     */
    readonly fullThoroughfare: string;

    /**
     * The city of the place.
     */
    readonly locality: string;

    /**
     * The postal code of the place.
     */
    readonly postCode: string;

    /**
     * The name of the area within the locality.
     */
    readonly subLocality: string;

    /**
     * The number on the street at the place.
     */
    readonly subThoroughfare: string;

    /**
     * The street name at the place.
     */
    readonly thoroughfare: string;
}
