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
import { ViteDevServer } from "vite";
import type { render } from "../../src/entry-server";

export type Render = typeof render;

export type RenderHTML = (...params: Parameters<Render>) => Promise<string>;

export interface PrepareRenderingOptions {
    readonly app: Express;
    readonly base: string;
    readonly appDir: string;
    readonly isProduction?: boolean;
}

export interface PreparedRendering {
    readonly vite?: ViteDevServer;
    readonly renderHTML: RenderHTML;
}

async function doRenderHTML(
    template: string,
    render: Render,
    ...params: Parameters<Render>
): Promise<string> {
    const rendered = await render(...params);
    const html = template
        .replace(`<!--app-html-->`, rendered.html ?? '');
    return html;
}

export default async function prepareRendering({
    app,
    base,
    appDir,
    isProduction = process.env.NODE_ENV === 'production'
}: PrepareRenderingOptions): Promise<PreparedRendering> {
    const distDir = path.join(appDir, 'dist');
    if (!isProduction) {
        const { createServer } = await import('vite');
        const vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
            base,
        });
        app.use(vite.middlewares);

        const renderHTML = async (...params: Parameters<Render>) => {
            const url = params[0];
            const rawTemplate = await fs.readFile(path.join(appDir, 'index.html'), 'utf-8')
            const template = await vite.transformIndexHtml(url, rawTemplate)
            const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
            return await doRenderHTML(template, render, ...params);
        };
        return { vite, renderHTML };
    } else {
        const { default: compression } = await import('compression');
        const { default: sirv } = await import('sirv');
        app.use(compression());
        app.use(base, sirv(path.join(distDir, 'client'), { extensions: [] }));

        const template = await fs.readFile(path.join(distDir, 'client', 'index.html'), 'utf-8');
        const { render } = await import(path.join(distDir, 'server', 'entry-server.js'));
        const renderHTML = async (...params: Parameters<Render>) => {
            return await doRenderHTML(template, render, ...params);
        }
        return { renderHTML };
    }
}
