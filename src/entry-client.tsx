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
import HttpApi from 'i18next-http-backend';
import { hydrate } from 'preact';
import App from './app';
import './styling/icons.css';
import './styling/layout.css';
import './styling/main.css';
import { getAccount } from './api/fetches';

// NOTE: This is initialized in the server/index.tsx for entry-server.tsx
await i18next.use(HttpApi).init({
    preload: ['en-US'],
    fallbackLng: 'en-US',
    ns: ['outside', 'units'],
    defaultNS: 'outside',
    interpolation: {
        escapeValue: false,
    },
    backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
});

const account = await getAccount().catch(() => undefined);

hydrate(<App account={account} />, document.getElementById('app')!);
