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
import { GlobalFooter } from "./global-footer";
import { GlobalHeader } from "./global-header";

export interface AppProps {
    readonly className?: string;
    readonly searchQuery?: string;
    readonly searchDisabled?: boolean;
    readonly children: ComponentChildren;
}

export function App({ className, searchQuery, searchDisabled, children }: AppProps) {
    const { i18n } = useContext(Deps);
    return (
        <html lang={i18n.resolvedLanguage}>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/style/reset.css" />
                <link rel="stylesheet" href="/style/layout.css" />
                <link rel="stylesheet" href="/style/main.css" />
                <link rel="stylesheet" href="/style/icons.css" />
                <link rel="icon" href="/image/icon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rokkitt:ital,wght@0,100..900;1,100..900&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&family=Rokkitt:ital,wght@0,100..900;1,100..900&display=swap" />
                <link rel="manifest" href="/app.webmanifest" crossorigin="use-credentials" />
                <title>
                    {i18n.t('appName')}{searchQuery !== undefined ? ` – ${searchQuery}` : null}
                </title>
            </head>
            <body className={className}>
                <GlobalHeader searchQuery={searchQuery} searchDisabled={searchDisabled} />
                <main>
                    {children}
                </main>
                <GlobalFooter />

                <script src="/script/client.js" />
            </body>
        </html>
    );
}
