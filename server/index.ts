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

import { milliseconds } from 'date-fns';
import express from 'express';
import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header';
import session from 'express-session';
import { createHttpTerminator } from 'http-terminator';
import i18next from "i18next";
import i18nextBackend, { FsBackendOptions } from 'i18next-fs-backend';
import { handle as handleI18n, LanguageDetector } from "i18next-http-middleware";
import http from "node:http";
import path from 'node:path';
import api from './api';
import prepareDeps from "./bootstrap/deps";
import prepareRendering from './bootstrap/rendering';
import AccountMiddleware from './middleware/AccountMiddleware';
import { env, envInt, envStrings } from './utilities/env';
import { ClientSessionStore } from './utilities/session-store';
import { setUpShutDownHooks } from './utilities/shut-down';

process.on('unhandledRejection', (reason: Error | any) => {
    console.log(`Unhandled Rejection: ${reason.message ?? reason}`);

    throw new Error(reason.message ?? reason);
});

const appDir = path.resolve(path.join(import.meta.dirname), '..');
const localesDir = path.join(appDir, 'locales');

await i18next
    .use(i18nextBackend)
    .use(LanguageDetector)
    .init<FsBackendOptions>({
        preload: ['en-US'],
        fallbackLng: 'en-US',
        ns: ['outside', 'units'],
        defaultNS: 'outside',
        backend: {
            loadPath: path.join(localesDir, '{{lng}}', '{{ns}}.json'),
        },
        interpolation: {
            escapeValue: false,
        }
    });

const deps = prepareDeps();

// Create http server
const app = express();

// Configure CSP
if (process.env.NODE_ENV === 'production') {
    app.use(expressCspHeader({
        directives: {
            'default-src': [SELF],
            'script-src': [SELF, INLINE],
            'style-src': [SELF, INLINE],
            'img-src': [SELF, 'data:'],
            'worker-src': [NONE],
            'block-all-mixed-content': true
        }
    }));
}

// Serve i18n
app.use('/locales', express.static(localesDir));
app.use(handleI18n(i18next));

// Serve API
app.use(session({
    store: new ClientSessionStore(),
    secret: envStrings("SESSION_SECRETS"),
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: milliseconds({ days: 30 }),
    },
}));
app.use(AccountMiddleware(deps));
app.use(api(deps));

// Serve HTML
const base = env('BASE', '/');
const { vite, prerender } = await prepareRendering({
    app,
    base,
    appDir,
});
app.use('*all', async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '')

        const { template, render } = await prerender(url);

        const rendered = await render(url, req.userAccount);

        const html = template
            .replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e)
        console.error(e, e.stack)
        res.status(500).end(e.stack)
    }
});

// Start http server
const server = http.createServer(app);
const httpTerminator = createHttpTerminator({
    server,
});

const port = envInt('PORT', 5173);
server.listen(port, () => {
    console.info(`Server started at http://localhost:${port}`)
});

setUpShutDownHooks({ server, httpTerminator });
