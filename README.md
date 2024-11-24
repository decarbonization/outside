# Outside

Prepare for any occasion with comprehensive weather forecasts from any device with a web browser.

Part of the [Just the Good Parts](https://justthegoodparts.kevinmacwhinnie.com) project.

[![Node.js CI](https://github.com/decarbonization/outside/actions/workflows/node.js.yml/badge.svg)](https://github.com/decarbonization/outside/actions/workflows/node.js.yml)

## Building

This project requires a recent version of Node.js and npm to build.

The following commands are available through `npm run`:

- `clean`: Remove all build artifacts from the project directory.
- `build`: Run the build process for all client and server side source code in the project.
    - `build:client`: Build just the client side source code.
    - `build:server`: Build just the server side source code.
    - `build:digitalocean`: A special variation of the `build` for use in a DigitalOcean app.
- `dev`: Run a development server with live reload.
- `start`: Build the project and start a server.
    - `start:dev`: A supporting command for `dev` not intended to be used on its own.
    - `start:digitalocean`: A special variation of the `start` for use in a DigitalOcean app.
- `test`: Run the project's unit tests.

To get started with the project, clone the repository and run `npm i --no-save && npm run dev`.

## Running

This project is itself free software, but depends on a number of proprietary services to work.

### Configuring Apple Services

In order for Outside to perform location related operations and fetch weather forecast data, it must be configured with:

- An Apple developer team.
- A MapKit JS app identifier and key.
- A WeatherKit REST app identifier and key.

These prerequisites require a paid Apple Developer account and can be created on the portal for said account.

Once these prerequisites have been created, the following environment variables must be set:

- `APPLE_TEAM_ID`: An Apple developer team.
- `APPLE_MAPS_APP_ID`: A MapKit JS app identifier.
- `APPLE_MAPS_KEY_ID`: A MapKit JS key identifier.
- `APPLE_MAPS_KEY`: A MapKit JS REST private key downloaded from the developer portal.
- `APPLE_WEATHER_APP_ID`: A WeatherKit REST app identifier.
- `APPLE_WEATHER_KEY_ID`: A WeatherKit REST key identifier.
- `APPLE_WEATHER_KEY`: A WeatherKit REST private key downloaded from the developer portal.

### Configuring Google Services

In order for Outside to fetch air quality data, it must be configured with a Google Maps platform API key. Once an API key has been created, the following environment variable must be set:

- `GOOGLE_MAPS_API_KEY`: A Google Maps platform API key with access to both the Air Quality and Pollen data features.

### Configuring User System

In order for Outside to allow users to sign in, it must be configured with the following environment variables:

- `SESSION_SECRETS`: A comma-separated list of secrets to sign session cookies with.
- `SALTS`: A comma-separated list of salts for passwords. The first salt in the list used for new password entries.
- `DATABASE_URL`: URL for the PostgreSQL server to connect to including username, password, and port.

####

To set up postgres for local development on macOS, install it with homebrew:

```sh
brew install postgresql
```

Once installed, you can start the server:

```sh
brew services start postgresql
```

Next, enter into an interactive session:

```sql
psql postgres
```

Create a user for outside:

```sql
create role outside with password 'alpine' login;
```

Then create a database for outside:

```sql
create database outside with owner outside;
```

It should then be possible to set the `DATABASE_URL` environment variable like so:

```
DATABASE_URL="postgres://outside:alpine@localhost:5432/outside"
```

### Additional Options

The following environment variables may be provided:

- `PORT`: The port to publish the HTTP server on. Defaults to `8000`.
- `HOST`: The unqualified hostname of the app. Defaults to `localhost`.
- `DAILY_FORECAST_LIMIT`: The number of days to include in the forecast. Defaults to `7`.
- `HOURLY_FORECAST_LIMIT`: The number of hours to include in the forecast. Defaults to `24`.
- `DAILY_POLLEN_FORECAST_LIMIT`: The number of days to include in the pollen forecast. Defaults to `3`.

All environment variables may be provided in a `.env` file.

To run the server locally, execute `npm run dev` in the project directory.
