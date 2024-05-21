# Outside

An Apple services powered platform agnostic weather app.

Requires nodejs and npm to build. An Apple developer team, WeatherKit app identifier and key, and MapKit app identifier and key are required for this app to run.

The following environment variables __must__ be provided:

- `APPLE_TEAM_ID`: An Apple developer team.
- `APPLE_MAPS_APP_ID`: A MapKit JS app identifier.
- `APPLE_MAPS_KEY_ID`: A MapKit JS key identifier.
- `APPLE_MAPS_KEY`: A MapKit JS REST private key downloaded from the developer portal.
- `APPLE_WEATHER_APP_ID`: A WeatherKit REST app identifier.
- `APPLE_WEATHER_KEY_ID`: A WeatherKit REST key identifier.
- `APPLE_WEATHER_KEY`: A WeatherKit REST private key downloaded from the developer portal.

The following environment variables may be provided:

- `PORT`: The port to publish the HTTP server on. Defaults to `8000`.

All environment variables may be provided in a `.env` file.

To run the server locally, execute `npm run dev` in the project directory.
