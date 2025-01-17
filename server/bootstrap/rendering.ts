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

import { Express } from "express";
import fs from 'node:fs/promises';
import path from 'node:path';

export interface PrepareRenderingOptions {
    readonly app: Express;
    readonly base: string;
    readonly appDir: string;
    readonly isProduction?: boolean;
}

export default async function prepareRendering({
    app,
    base,
    appDir,
    isProduction = process.env.NODE_ENV === 'production'
}: PrepareRenderingOptions) {
    const distDir = path.join(appDir, 'dist');
    if (!isProduction) {
        const { createServer } = await import('vite');
        const vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
            base,
        });
        app.use(vite.middlewares);

        const prerender = async (url: string) => {
            const rawTemplate = await fs.readFile(path.join(appDir, 'index.html'), 'utf-8')
            const template = await vite.transformIndexHtml(url, rawTemplate)
            const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
            return { template, render };
        };
        return { vite, prerender };
    } else {
        const { default: compression } = await import('compression');
        const { default: sirv } = await import('sirv');
        app.use(compression());
        app.use(base, sirv(path.join(distDir, 'client'), { extensions: [] }));

        const template = await fs.readFile(path.join(distDir, 'client', 'index.html'), 'utf-8');
        const { render } = await import(path.join(distDir, 'server', 'entry-server.js'));
        const prerender = async (_url: string) => {
            return { template, render };
        }
        return { prerender };
    }
}
