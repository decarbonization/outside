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
import { MailtrapClient } from "mailtrap";
import { UserSessionStore } from "../accounts/sessions";
import { UnknownUserError, UserStore } from "../accounts/users";
import { renderLogin } from "../templates/login";
import { env } from "../utilities/env";
import { proveString } from "../utilities/maybe";
import { makeDeps } from "../views/_deps";
import { fullyQualifiedLinkTo, linkTo } from "./_links";

export interface LoginRouteOptions {
    readonly users: UserStore;
    readonly sessions: UserSessionStore;
    readonly mailer: MailtrapClient;
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
    { users, sessions, mailer }: LoginRouteOptions,
    req: Request<object, any, { email?: string }>,
    res: Response
): Promise<void> {
    const email = req.body.email;
    if (email === undefined) {
        throw new Error();
    }
    try {
        const i18n = req.i18n;
        const { uid } = await users.getUser({ by: "email", email });
        const { sid, otp } = await sessions.startSession(uid);
        req.session.sid = String(sid);
        console.info(`Started session <${sid}> with otp <${otp}> for <${email}>`);
        const verifyLink = fullyQualifiedLinkTo({ where: "loginVerify", otp });
        await mailer.send({
            from: {
                email: env("MAILTRAP_SENDER"),
                name: i18n.t('session.emailSenderName'),
            },
            to: [
                {
                    email
                }
            ],
            subject: i18n.t("session.emailSubject"),
            text: i18n.t("session.emailText", { verifyLink, interpolation: { escapeValue: false } }),
            category: "Outside Weather Logins"
        });
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

async function getLogout(
    { sessions }: LoginRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const sid = req.sid;
    if (sid !== undefined) {
        await sessions.endSession(sid);
        req.session.sid = undefined;
        console.info(`Ended session <${sid}>`);
    }
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
        .get('/logout', async (req, res) => {
            await getLogout(options, req, res);
        });
}
