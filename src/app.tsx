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
import { ErrorBoundary, lazy, LocationProvider, Route, Router } from 'preact-iso';
import { useMemo } from 'preact/hooks';
import { GetAccountResponseBody } from './api/types';
import { DepsObject, DepsProvider } from './hooks/Deps';
import HomePage from './routes/HomePage';
import WeatherPage from './routes/WeatherPage'; // TODO: Why can't this be lazy?
import useFetch from './hooks/Fetch';
import { getAccount } from './api/fetches';
import { SessionObject, SessionProvider } from './hooks/Session';
import { ifNotUndef } from 'its-it/nullable';

const AccountPage = lazy(() => import('./routes/AccountPage'));
const ForgotPasswordPage = lazy(() => import('./routes/ForgotPasswordPage'));
const ForgotPasswordRecoverPage = lazy(() => import('./routes/ForgotPasswordRecoverPage'));
const SignInPage = lazy(() => import('./routes/SignInPage'));
const SignUpPage = lazy(() => import('./routes/SignUpPage'));

// TODO: GET /sign-up/verify

export interface AppProps {
    readonly ssrSession?: SessionObject;
}

export default function App({ ssrSession }: AppProps) {
    const { data: session } = useFetch<SessionObject>({
        initialValue: ssrSession,
        fetchKey: ['getAccount'],
        fetchFn: async () => {
            try {
                const account = await getAccount();
                return {
                    isLoggedIn: true,
                    userID: account.id,
                    email: account.email,
                };
            } catch {
                return {
                    isLoggedIn: false,
                };
            }
        },
    });
    const deps = useMemo<DepsObject>(() => ({
        i18n: i18next,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }), []);
    return (
        <SessionProvider session={session}>
            <DepsProvider deps={deps}>
                <LocationProvider>
                    <ErrorBoundary>
                        <Router>
                            <Route path="/" component={HomePage} />
                            <Route path="/weather/:country/:latitude/:longitude/:locality" component={WeatherPage} />
                            <Route path="/sign-in" component={SignInPage} />
                            <Route path="/sign-up" component={SignUpPage} />
                            <Route path="/forgot-password" component={ForgotPasswordPage} />
                            <Route path="/forgot-password/recover" component={ForgotPasswordRecoverPage} />
                            <Route path="/account" component={AccountPage} />
                        </Router>
                    </ErrorBoundary>
                </LocationProvider>
            </DepsProvider>
        </SessionProvider>
    );
}
