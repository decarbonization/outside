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
import { Account } from '../accounts/account';
import { UserSystem } from '../accounts/system';
import { SessionID } from '../accounts/schemas';

declare global {
    namespace Express {
        interface Request {
            userAccount?: Account;
        }
    }
}

declare module 'express-session' {
    interface SessionData {
        sid?: SessionID;
    }
}

export interface AccountMiddlewareOptions {
    readonly userSystem: UserSystem;
}

export function accountMiddleware({ userSystem }: AccountMiddlewareOptions): RequestHandler {
    return async (req, _res, next): Promise<void> => {
        req.userAccount = await userSystem.getAccount(req.session.sid);
        next();
    };
}
