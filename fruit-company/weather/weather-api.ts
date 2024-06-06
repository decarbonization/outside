import jwt, { JwtHeader } from "jsonwebtoken";
import { ApiCall, ApiError, ApiFetch, ApiToken } from "../api";
import { LocationCoordinates, urlLocationCoordinates } from "../maps/models/base";
import { Attribution } from "./models/attribution";
import { Weather } from "./models/weather";

const weatherUrl = "https://weatherkit.apple.com/api/v1";

export class WeatherToken implements ApiToken {
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

export const allWeatherDataSets: readonly WeatherDataSet[] = [
    WeatherDataSet.currentWeather,
    WeatherDataSet.forecastDaily,
    WeatherDataSet.forecastHourly,
    WeatherDataSet.forecastNextHour,
    WeatherDataSet.weatherAlerts,
];

export class WeatherQuery implements ApiCall<WeatherToken, Weather> {
    constructor(readonly options: Readonly<{
        language: string,
        location: LocationCoordinates,
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

    prepare(token: WeatherToken): Request {
        const url = new URL(`${weatherUrl}/weather/${this.options.language}/${this.options.location.latitude}/${this.options.location.longitude}`);
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
                url.searchParams.append(key, urlLocationCoordinates(value as LocationCoordinates));
            } else {
                throw new Error(`GetWeatherOptions.${key} invalid <${value}>`);
            }
        }
        return new Request(url, { headers: token.headers });
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

    toString(): string {
        return `WeatherQuery(${JSON.stringify(this.options)})`;
    }
}

export class WeatherAttribution implements ApiCall<WeatherToken, Attribution> {
    constructor(readonly options: Readonly<{
        language: string
    }>) {
    }

    prepare(_token: WeatherToken): Request {
        const url = new URL(`https://weatherkit.apple.com/attribution/${this.options.language}`);
        return new Request(url);
    }

    async parse(response: Response): Promise<Attribution> {
        const raw = await response.text();
        const object = JSON.parse(raw, (key, value) => {
            if (key.startsWith("logo")) {
                return `https://weatherkit.apple.com${value}`;
            } else {
                return value;
            }
        });
        return object as Attribution;
    }

    toString(): string {
        return `WeatherAttribution(${JSON.stringify(this.options)})`;
    }
}
