import { addDays, addHours } from "date-fns";
import { Router } from "express";
import fs from "fs/promises";
import { find } from "geo-tz";
import path from "path";
import { perform } from "../../fruit-company/api";
import { WeatherDataSet, WeatherQuery, WeatherToken } from "../../fruit-company/weather/weather-api";
import { loadTheme } from "../styling/themes";
import { renderWeather } from "../templates/weather";
import { DepsObject } from "../views/_deps";

export interface WeatherRoutesOptions {
    readonly weatherToken: WeatherToken;
}

export function WeatherRoutes({ weatherToken }: WeatherRoutesOptions): Router {
    return Router()
        .get('/weather/:country/:latitude/:longitude', async (req, res) => {
            const deps: DepsObject = {
                i18n: req.i18n,
                theme: await loadTheme(),
            };
            const query = req.query["q"] as string | undefined;
            const language = req.i18n.resolvedLanguage ?? req.language;
            const location = {
                latitude: Number(req.params.latitude),
                longitude: Number(req.params.longitude),
            };
            const timezone = find(location.latitude, location.longitude)[0];
            const countryCode = req.params.country;
            const currentAsOf = new Date();
            const weather = await perform({
                token: weatherToken, call: new WeatherQuery({
                    language,
                    location,
                    timezone,
                    countryCode,
                    currentAsOf,
                    dailyEnd: addDays(currentAsOf, 10),
                    dailyStart: currentAsOf,
                    dataSets: [
                        WeatherDataSet.currentWeather,
                        WeatherDataSet.forecastDaily,
                        WeatherDataSet.forecastHourly,
                        WeatherDataSet.forecastNextHour,
                        WeatherDataSet.weatherAlerts,
                    ],
                    hourlyEnd: addHours(currentAsOf, 30),
                    hourlyStart: currentAsOf,
                })
            });
            const resp = renderWeather({ deps, query, weather });
            res.type('html').send(resp);
        })
        .get('/sample', async (req, res) => {
            const deps: DepsObject = {
                i18n: req.i18n,
                theme: await loadTheme(),
            };
            const rawWeather = await fs.readFile(path.join(__dirname, "..", "..", "wk-sample.json"), "utf-8");
            const weatherResponse = new Response(rawWeather, {
                headers: {},
                status: 200,
                statusText: "OK",
            });
            const fakeWeatherQuery = new WeatherQuery({
                language: "none", 
                location: { latitude: 0, longitude: 0 }, 
                timezone: "nowhere",
            });
            const weather = await fakeWeatherQuery.parse(weatherResponse);
            const resp = renderWeather({ deps, weather });
            res.type('html').send(resp);
        });
}
