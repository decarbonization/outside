/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import i18next from 'i18next';
import { ErrorBoundary, LocationProvider, Route, Router } from 'preact-iso';
import { useMemo } from 'preact/hooks';
import { DepsObject, DepsProvider } from './hooks/Deps';
import HomePage from './routes/HomePage';
import WeatherPage from './routes/WeatherPage'; // TODO: Why can't this be lazy?

export default function App() {
    const deps = useMemo<DepsObject>(() => ({
        i18n: i18next,
        isUserLoggedIn: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }), []);
    return (
        <DepsProvider deps={deps}>
            <LocationProvider>
                <ErrorBoundary>
                    <Router>
                        <Route path="/" component={HomePage} />
                        <Route path="/weather/:country/:latitude/:longitude/:locality" component={WeatherPage} />
                    </Router>
                </ErrorBoundary>
            </LocationProvider>
        </DepsProvider>
    );
}
