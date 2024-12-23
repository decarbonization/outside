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

import http from "http";
import { HttpTerminator } from "http-terminator";

// Based on <https://www.codeconcisely.com/posts/graceful-shutdown-in-express/>.

export interface ShutDownOptions {
    readonly server: http.Server;
    readonly httpTerminator: HttpTerminator;
    readonly code?: number;
    readonly timeout?: number;
}

export async function shutDown({ server, httpTerminator, code = 0, timeout = 5000 }: ShutDownOptions): Promise<never> {
    try {
        console.info(`Shutting down with code ${code}`);
        setTimeout(() => {
            console.warn("Graceful shut down timed out, forcing shut down");
            process.exit(code);
        }, timeout).unref();

        if (server.listening) {
            console.info("Terminating HTTP connections");
            await httpTerminator.terminate();
        }
    } catch (error) {
        console.error(`Graceful shut down failed: ${error}`);
    }
    process.exit(code);
}

export function setUpShutDownHooks(options: Omit<ShutDownOptions, "code">): void {
    process.on('uncaughtException', (error: Error) => {
        console.error(`Uncaught Exception: ${error.message}`, error.stack);
        shutDown({ code: 1, ...options });
    });

    process.on('SIGTERM', () => {
        console.info(`Process ${process.pid} received SIGTERM`);
        shutDown({ code: 0, ...options });
    });

    process.on('SIGINT', () => {
        console.info(`Process ${process.pid} received SIGINT`);
        shutDown({ code: 0, ...options });
    });
}
