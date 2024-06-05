/*
 * outside weather app
 * Copyright (C) 2024  MAINTAINERS
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

import { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { Deps } from "./_deps";

export interface AppProps {
    readonly className?: string;
    readonly children: ComponentChildren;
}

export function App({ className, children }: AppProps) {
    const { i18n, theme } = useContext(Deps);
    return (
        <html lang={i18n.resolvedLanguage}>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/styles/defaults.css" />
                {theme.links.map(({ rel, href, crossorigin = false }) => (
                    <link rel={rel} href={href} crossorigin={crossorigin ? "" : undefined} />
                ))}
                <link rel="manifest" href="/app.webmanifest" crossorigin="use-credentials" />
                <title>{i18n.t('appName')}</title>
            </head>
            <body className={className}>
                <main>
                    <h1>{i18n.t('appName')}</h1>
                    {children}
                </main>

                <script type="module" src="/script/index.js" />
            </body>
        </html>
    );
}
