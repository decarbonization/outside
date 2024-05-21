import { addSeconds } from "date-fns";
import { ApiCall, ApiError, ApiFetch, ApiToken } from "../api";
import jwt, { JwtHeader } from "jsonwebtoken";
import { PlaceResults } from "./models/places";
import { LocationCoordinates, urlLocationCoordinates } from "./models/base";

const mapsUrl = "https://maps-api.apple.com/v1";

/**
 * An object that contains an access token and an expiration time in seconds.
 */
interface TokenResponse {
    /**
     * A string that represents the access token.
     */
    readonly accessToken: string;

    /**
     * An integer that indicates the time, in seconds from now until the token expires.
     */
    readonly expiresInSeconds: number;
}

/**
 * Information about an error that occurs while processing a request.
 */
interface ErrorResponse {
    /**
     * An array of strings with additional details about the error
     */
    readonly details: string[];

    /**
     * A message that provides details about the error.
     */
    readonly message: string;
}

export class MapsToken implements ApiToken {
    constructor(
        private readonly appId: string,
        private readonly teamId: string,
        private readonly keyId: string,
        private readonly privateKey: string | Buffer
    ) {
        this.accessToken = "";
        this.expiresAt = new Date(0);
    }

    private accessToken: string;
    private expiresAt: Date;

    get headers(): Headers {
        return new Headers([
            ["Authorization", `Bearer ${this.accessToken}`],
        ]);
    }

    get retryLimit(): number {
        return 2;
    }

    get isValid(): boolean {
        return (this.accessToken !== "" && new Date() > this.expiresAt);
    }

    async refresh(fetch: ApiFetch): Promise<void> {
        const authToken = jwt.sign({
            sub: this.appId,
        }, this.privateKey, {
            issuer: this.teamId,
            expiresIn: "1m",
            keyid: this.keyId,
            algorithm: "ES256",
            header: {
                id: `${this.teamId}.${this.appId}`,
            } as unknown as JwtHeader,
        });

        const response = await fetch(`${mapsUrl}/token`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!response.ok) {
            const errorResponse = await response.json() as ErrorResponse;
            throw new ApiError(
                response.status, 
                response.statusText, 
                `${errorResponse.message} (${errorResponse.details.join(', ')})`
            );
        }
        const tokenResponse = await response.json() as TokenResponse;
        this.accessToken = tokenResponse.accessToken;
        this.expiresAt = addSeconds(new Date(), tokenResponse.expiresInSeconds);
    }
}

class MapsCall<Result> implements ApiCall<MapsToken, Result> {
    constructor() {
    }

    prepare(_token: MapsToken): Request {
        throw new Error("Method not implemented.");
    }

    async parse(response: Response): Promise<Result> {
        if (!response.ok) {
            const errorResponse = await response.json() as ErrorResponse;
            throw new ApiError(
                response.status, 
                response.statusText, 
                `${errorResponse.message} (${errorResponse.details.join(', ')})`
            );
        }
        return await response.json() as Result;
    }
}

export class GeocodeAddress extends MapsCall<PlaceResults> {
    constructor(readonly options: Readonly<{
        query: string,
        limitToCountries?: string[],
        language?: string,
        searchLocation?: LocationCoordinates,
        searchRegion?: LocationCoordinates,
        userLocation?: LocationCoordinates,
    }>) {
        super();
    }

    override prepare(token: MapsToken): Request {
        const url = new URL(`${mapsUrl}/geocode`);
        url.searchParams.append("q", this.options.query);
        if (this.options.limitToCountries !== undefined) {
            url.searchParams.append("limitToCountries", this.options.limitToCountries.join(","));
        }
        if (this.options.language !== undefined) {
            url.searchParams.append("lang", this.options.language);
        }
        if (this.options.searchLocation !== undefined) {
            url.searchParams.append("searchLocation", urlLocationCoordinates(this.options.searchLocation));
        }
        if (this.options.searchRegion !== undefined) {
            url.searchParams.append("searchRegion", urlLocationCoordinates(this.options.searchRegion));
        }
        if (this.options.userLocation !== undefined) {
            url.searchParams.append("userLocation", urlLocationCoordinates(this.options.userLocation));
        }
        return new Request(url, {headers: token.headers});
    }

    override toString(): string {
        return `GeocodeAddress(${JSON.stringify(this.options)})`;
    }
}

export class ReverseGeocodeAddress extends MapsCall<PlaceResults> {
    constructor(readonly options: Readonly<{
        location: LocationCoordinates,
        language?: string,
    }>) {
        super();
    }

    override prepare(token: MapsToken): Request {
        const url = new URL(`${mapsUrl}/reverseGeocode`);
        url.searchParams.append("loc", urlLocationCoordinates(this.options.location));
        if (this.options.language !== undefined) {
            url.searchParams.append("lang", this.options.language);
        }
        return new Request(url, {headers: token.headers});
    }

    override toString(): string {
        return `ReverseGeocodeAddress(${JSON.stringify(this.options)})`;
    }
}
