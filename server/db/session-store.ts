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

import { SessionData, Store } from "express-session";
import { ClientSessionModel } from "./models/client-session";

export class ClientSessionStore extends Store {
    override get(sid: string, callback: (err: any, session?: SessionData | null) => void): void {
        (async () => {
            try {
                const model = await ClientSessionModel.findOne({ where: { id: sid }});
                if (model === null) {
                    callback(null, null);
                } else {
                    callback(null, model.data);
                }
            } catch (err) {
                callback(err, null);
            }
        })();
    }

    override set(sid: string, session: SessionData, callback?: (err?: any) => void): void {
        (async () => {
            try {
                await ClientSessionModel.upsert({
                    id: sid,
                    data: session,
                });
                callback?.(null);
            } catch (err) {
                callback?.(err);
            }
        })();
    }
    
    override destroy(sid: string, callback?: (err?: any) => void): void {
        (async () => {
            try {
                await ClientSessionModel.destroy({ where: { id: sid } });
                callback?.(null);
            } catch (err) {
                callback?.(err);
            }
        })();
    }

    override all(callback: (err: any, obj?: SessionData[] | { [sid: string]: SessionData; } | null) => void): void {
        (async () => {
            try {
                const sessions: Record<string, SessionData> = {};
                const models = await ClientSessionModel.findAll();
                for (const model of models) {
                    sessions[model.id] = model.data;
                }
                callback(null, sessions);
            } catch (err) {
                callback(err);
            }
        })();
    }

    override length(callback: (err: any, length?: number) => void): void {
        (async () => {
            try {
                const count = await ClientSessionModel.count();
                callback(null, count);
            } catch (err) {
                callback(err);
            }
        })();
    }

    override clear(callback?: (err?: any) => void): void {
        (async () => {
            try {
                await ClientSessionModel.destroy();
                callback?.(null);
            } catch (err) {
                callback?.(err);
            }
        })();
    }
}
