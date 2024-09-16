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

import { urlencoded } from "body-parser";
import { Request, Response, Router } from "express";
import { UserSessionStore } from "../accounts/sessions";
import { UnknownUserError, UserStore } from "../accounts/users";
import { renderLogin } from "../templates/login";
import { makeDeps } from "../views/_deps";
import { linkTo } from "./_links";
import { envFlag } from "../utilities/env";
import { proveString } from "../utilities/maybe";

export interface LoginRouteOptions {
    readonly users: UserStore;
    readonly sessions: UserSessionStore;
}

async function getLogin(
    { }: LoginRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const deps = await makeDeps({ req });
    const resp = renderLogin({ deps });
    res.type('html').send(resp);
}

async function postLogin(
    { users, sessions }: LoginRouteOptions,
    req: Request<object, any, { email?: string }>,
    res: Response
): Promise<void> {
    const email = req.body.email;
    if (email === undefined) {
        throw new Error();
    }
    try {
        const { uid } = envFlag("ENABLE_NEW_ACCOUNTS", false)
            ? await users.getOrInsertUser({ by: "email", email }, () => ({ email }))
            : await users.getUser({ by: "email", email });
        const { sid, otp } = await sessions.startSession(uid);
        req.session.sid = String(sid);
        // TODO: Send email
        console.info(`Started session <${sid}> with otp <${otp}> for <${email}>`);
        const deps = await makeDeps({ req });
        const resp = renderLogin({ deps, email, message: 'emailSent' });
        res.type('html').send(resp);
    } catch (err) {
        if (!(err instanceof UnknownUserError)) {
            throw err;
        }
        const deps = await makeDeps({ req });
        const resp = renderLogin({ deps, email, message: 'noSuchUser' });
        res.status(401).type('html').send(resp);
    }
}

async function getLoginVerify(
    { sessions }: LoginRouteOptions,
    req: Request<{ otp: string }>,
    res: Response
): Promise<void> {
    const sid = req.sid;
    if (sid === undefined) {
        throw new Error("No active user session");
    }
    const otp = req.params.otp;
    const uid = await sessions.authenticateSession(sid, otp);
    console.info(`Authenticated session <${sid}> for <${uid}>`);
    const returnTo = proveString(req.query["returnto"]);
    if (returnTo !== undefined) {
        res.redirect(returnTo);
    } else {
        res.redirect(linkTo({ where: "index" }));
    }
}

export function LoginRoutes(options: LoginRouteOptions) {
    return Router()
        .get('/login', async (req, res) => {
            await getLogin(options, req, res);
        })
        .post('/login', urlencoded({ extended: true, parameterLimit: 1 }), async (req, res) => {
            await postLogin(options, req, res);
        })
        .get('/login/verify/:otp', async (req, res) => {
            await getLoginVerify(options, req, res);
        })
}
