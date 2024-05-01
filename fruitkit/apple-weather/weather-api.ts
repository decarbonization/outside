import jwt, { JwtHeader } from "jsonwebtoken";
import { Weather } from "./models/weather";
import { ApiCall, ApiError, ApiFetch, ApiToken } from "../api";
import { GeoLocation, urlifyGeoLocation } from "../apple-maps/models/base";

const weatherKitUrl = "https://weatherkit.apple.com/api/v1";

export class WeatherKitToken implements ApiToken {
    constructor(
        private readonly appId: string,
        private readonly teamId: string,
        private readonly keyId: string,
        private readonly privateKey: string | Buffer
    ) {
        this.bearerToken = "";
    }

    private bearerToken: string;

    get retryLimit(): number {
        return 1;
    }

    get headers(): Headers {
        return new Headers([
            ["Authorization", `Bearer ${this.bearerToken}`],
        ]);
    }

    get isValid(): boolean {
        return (this.bearerToken !== "");
    }

    async refresh(_fetch: ApiFetch): Promise<void> {
        this.bearerToken = jwt.sign({
            sub: this.appId,
        }, this.privateKey, {
            issuer: this.teamId,
            expiresIn: "24h",
            keyid: this.keyId,
            algorithm: "ES256",
            header: {
                id: `${this.teamId}.${this.appId}`,
            } as unknown as JwtHeader,
        });
    }
}

export const enum WeatherDataSet {
    currentWeather = "currentWeather",
    forecastDaily = "forecastDaily",
    forecastHourly = "forecastHourly",
    forecastNextHour = "forecastNextHour",
    weatherAlerts = "weatherAlerts",
}
export class WeatherQuery implements ApiCall<WeatherKitToken, Weather> {
    constructor(readonly options: Readonly<{
        language: string,
        location: GeoLocation,
        timezone: string,
        countryCode?: string,
        currentAsOf?: Date,
        dailyEnd?: Date,
        dailyStart?: Date,
        dataSets?: readonly WeatherDataSet[],
        hourlyEnd?: Date,
        hourlyStart?: Date
    }>) {
    }

    prepare(token: WeatherKitToken): Parameters<ApiFetch> {
        const url = new URL(`${weatherKitUrl}/weather/${this.options.language}/${this.options.location.latitude}/${this.options.location.longitude}`);
        for (const [key, value] of Object.entries(this.options)) {
            if (Array.isArray(value)) {
                url.searchParams.append(key, value.join(","));
            } else if (value instanceof Date) {
                url.searchParams.append(key, value.toISOString());
            } else if (typeof value === "number") {
                url.searchParams.append(key, String(value));
            } else if (typeof value === "string") {
                url.searchParams.append(key, value);
            } else if (key === "location" && typeof value === "object") {
                url.searchParams.append(key, urlifyGeoLocation(value as GeoLocation));
            } else {
                throw new Error(`GetWeatherOptions.${key} invalid <${value}>`);
            }
        }
        return [url, {headers: token.headers}];
    }

    async parse(response: Response): Promise<Weather> {
        const raw = await response.text();
        const object = JSON.parse(raw, (key, value) => {
        if (typeof value === 'string' && (key === "asOf"
            || key === "moonrise"
            || key === "moonset"
            || key.startsWith("solar")
            || key.startsWith("sunrise")
            || key.startsWith("sunset")
            || key.endsWith("Time")
            || key.endsWith("End")
            || key.endsWith("Start"))) {
            return new Date(value);
        } else {
            return value;
        }
        });
        if (!response.ok) {
            throw new ApiError(response.status, response.statusText, `<${response.url}>`);
        }
        return object as Weather;
    }
}
