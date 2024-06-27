import dotenv from 'dotenv';
import { WeatherToken } from 'fruit-company';

dotenv.config();

const weatherToken = new WeatherToken(
    process.env["APPLE_WEATHER_APP_ID"],
    process.env["APPLE_TEAM_ID"],
    process.env["APPLE_WEATHER_KEY_ID"],
    process.env["APPLE_WEATHER_KEY"],
);
await weatherToken.refresh();

for (const [name, value] of weatherToken.headers.entries()) {
    console.log(`${name}: ${value}`);
}
