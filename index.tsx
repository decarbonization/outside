import { addDays, addHours } from 'date-fns';
import dotenv from 'dotenv';
import express from 'express';
import fs from "fs";
import i18next from "i18next";
import i18nextBackend, { FsBackendOptions } from 'i18next-fs-backend';
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";
import render from "preact-render-to-string";
import { App } from "./app/views/_app";
import { WeatherSearch } from './app/views/weather-search';
import { WeatherDetails } from './app/views/weather-details';
import { perform } from './fruitkit/api';
import { GeocodeAddress, MapsToken } from './fruitkit/apple-maps/maps-api';
import { GeoLocation } from './fruitkit/apple-maps/models/base';
import { Weather } from "./fruitkit/apple-weather/models/weather";
import { WeatherDataSet, WeatherKitToken, WeatherQuery } from './fruitkit/apple-weather/weather-api';

dotenv.config();

i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init<FsBackendOptions>({
    preload: ['en-US'],
    fallbackLng: 'en-US',
    ns: ['outside', 'units'],
    defaultNS: 'outside',
    backend: {
      loadPath: path.join(__dirname, 'locales', '{{lng}}', '{{ns}}.json'),
    },
  });

const app = express();
const mapsToken = new MapsToken(
  process.env.APPLE_MAPS_APP_ID!,
  process.env.APPLE_TEAM_ID!,
  process.env.APPLE_MAPS_KEY_ID!,
  fs.readFileSync(path.join(__dirname, process.env.APPLE_MAPS_KEY_NAME!)),
);
const weatherKitToken = new WeatherKitToken(
  process.env.APPLE_WEATHER_APP_ID!,
  process.env.APPLE_TEAM_ID!,
  process.env.APPLE_WEATHER_KEY_ID!,
  fs.readFileSync(path.join(__dirname, process.env.APPLE_WEATHER_KEY_NAME!)),
);

app.use(express.static(path.join(__dirname, "public")));
app.use('/locales', express.static(path.join(__dirname, 'locales')));
app.use(i18nextMiddleware.handle(i18next));

app.get('/', async (req, res) => {
  await i18next.changeLanguage(req.i18n.resolvedLanguage);

  const query = req.query["q"] as string | undefined;
  const results = query !== undefined 
    ? await perform({
        token: mapsToken, 
        call: new GeocodeAddress({query: query, language: req.i18n.resolvedLanguage})
      })
    : undefined;

  const resp = render(
    <App>
      <WeatherSearch query={query} results={results} />
    </App>
  );
  res.type('html').send(`<!DOCTYPE html>${resp}`);
});

app.get('/weather/:lat/:lon', async (req, res) => {
  await i18next.changeLanguage(req.i18n.resolvedLanguage);

  const now = new Date();
  const weather = await perform({token: weatherKitToken, call: new WeatherQuery({
    language: req.i18n.resolvedLanguage ?? req.language,
    location: {
      latitude: Number(req.params["lat"]),
      longitude: Number(req.params["lon"]),
    },
    timezone: "America/NewYork",
    countryCode: "US",
    currentAsOf: now,
    dailyEnd: addDays(now, 10),
    dailyStart: now,
    dataSets: [
      WeatherDataSet.currentWeather,
      WeatherDataSet.forecastDaily,
      WeatherDataSet.forecastHourly,
      WeatherDataSet.forecastNextHour,
      WeatherDataSet.weatherAlerts,
    ],
    hourlyEnd: addHours(now, 30),
    hourlyStart: now,
  })});
  const resp = render(
    <App>
      <WeatherDetails location={req.query["where"] as string} weather={weather} />
    </App>
  );
  res.type('html').send(`<!DOCTYPE html>${resp}`);
});

app.get('/sample', async (req, res) => {
  await i18next.changeLanguage(req.i18n.resolvedLanguage);

  const rawSample = fs.readFileSync(path.join(__dirname, "wk-sample.json"), "utf-8");
  const sample = JSON.parse(rawSample, (key, value) => {
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
  }) as Weather;
  
  const resp = render(
    <App>
      <WeatherDetails weather={sample} />
    </App>
  );
  res.type('html').send(`<!DOCTYPE html>${resp}`);
});

const port = process.env.PORT ?? 8000;
app.listen(port, () => {
  console.log(`Proxy is running at http://localhost:${port} from ${__dirname}`);
});