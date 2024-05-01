import { GeoLocation, MapRegion, StructuredAddress } from "./base";

/**
 * An object that describes a place in terms of a variety of spatial, administrative, and qualitative properties.
 */
export interface Place {
    /**
     * The country or region of the place.
     */
    readonly country: string;

    /**
     * The 2-letter country code of the place.
     */
    readonly countryCode: string;

    /**
     * The geographic region associated with the place.
     * 
     * This is a rectangular region on a map expressed as south-west and north-east points.
     * Specifically south latitude, west longitude, north latitude, and east longitude.
     */
    readonly displayMapRegion: MapRegion;
    
    /**
     * The address of the place, formatted using its conventions of its country or region.
     */
    readonly formattedAddressLines: string[];

    /**
     * A place name that you can use for display purposes.
     */
    readonly name: string;

    /**
     * The latitude and longitude of this place.
     */
    readonly coordinate: GeoLocation;

    /**
     * A StructuredAddress object that describes details of the place’s address.
     */
    readonly structuredAddress: StructuredAddress;
}

/**
 * An object that contains an array of places.
 */
export interface PlaceResults {
    /**
     * An array of one or more Place objects.
     */
    readonly results: Place[];
}
