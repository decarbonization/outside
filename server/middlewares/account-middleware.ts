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

import { RequestHandler } from 'express';
import { UserSessionStore } from '../accounts/sessions';
import { UserID } from '../accounts/users';
import { UserPreferences, UserPreferenceStore } from '../accounts/preferences';
import { mapIfNotUndefined } from '../utilities/maybe';

declare global {
    namespace Express {
        interface Request {
            sid?: number;
            uid?: UserID;
            prefs: UserPreferences;
        }
    }
}

declare module 'express-session' {
    interface SessionData {
        sid?: string;
    }
}

export interface AccountMiddlewareOptions {
    readonly sessions: UserSessionStore;
    readonly preferences: UserPreferenceStore;
}

export function accountMiddleware({ sessions, preferences }: AccountMiddlewareOptions): RequestHandler {
    return async (req, _res, next): Promise<void> => {
        const sid = mapIfNotUndefined(req.session.sid, raw => parseInt(raw, 10));
        const uid = await mapIfNotUndefined(sid, sid => sessions.getSessionUserID(sid));
        req.sid = sid;
        req.uid = uid;
        req.prefs = new UserPreferences(uid, preferences);
        next();
    };
}