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
import { UserSystemError } from "../accounts/errors";
import { UserSystem } from "../accounts/system";
import { renderSignIn } from "../templates/sign-in";
import { renderSignUp } from "../templates/sign-up";
import { env } from "../utilities/env";
import { proveString } from "../utilities/maybe";
import { makeDeps } from "../views/_deps";
import { renderForgotPassword } from "../views/accounts/forgot-password";
import { fullyQualifiedLinkTo, linkTo } from "./_links";
import { renderAccountSettings } from "../views/accounts/account-settings";

export interface UserRouteOptions {
    readonly userSystem: UserSystem;
    readonly mailer: MailtrapClient;
}

async function getSignIn(
    { }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const returnTo = proveString(req.query["returnto"]);
    const deps = await makeDeps({ req });
    const resp = renderSignIn({ deps, returnTo });
    res.type('html').send(resp);
}

async function postSignIn(
    { userSystem }: UserRouteOptions,
    req: Request<object, any, { email?: string, password?: string }>,
    res: Response
): Promise<void> {
    const email = req.body.email;
    if (email === undefined) {
        throw new Error();
    }
    const password = req.body.password;
    if (password === undefined) {
        throw new Error();
    }
    try {
        const session = await userSystem.signIn(email, password);
        req.session.sid = session.id;
        console.info(`Started session <${session.id}> for <${email}>`);
        const returnTo = proveString(req.query["returnto"]);
        if (returnTo !== undefined) {
            res.redirect(returnTo);
        } else {
            res.redirect(linkTo({ where: "index" }));
        }
    } catch (err) {
        if (!UserSystemError.is(err, 'unknownUser')) {
            throw err;
        }
        const deps = await makeDeps({ req });
        const resp = renderSignIn({ deps, email, message: 'noSuchUser' });
        res.status(401).type('html').send(resp);
    }
}

async function getSignOut(
    { userSystem }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const account = req.userAccount;
    if (account !== undefined) {
        await userSystem.signOut(account.sessionID);
        req.session.sid = undefined;
        console.info(`Ended session <${account.sessionID}>`);
    }
    const returnTo = proveString(req.query["returnto"]);
    if (returnTo !== undefined) {
        res.redirect(returnTo);
    } else {
        res.redirect(linkTo({ where: "index" }));
    }
}

async function getSignUp(
    { }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const returnTo = proveString(req.query["returnto"]);
    const deps = await makeDeps({ req });
    const resp = renderSignUp({ deps, returnTo });
    res.type('html').send(resp);
}

async function postSignUp(
    { userSystem, mailer }: UserRouteOptions,
    req: Request<object, any, { email?: string, password?: string, confirm_password?: string }>,
    res: Response
): Promise<void> {
    const email = req.body.email;
    if (email === undefined) {
        throw new Error();
    }
    const password = req.body.password;
    if (password === undefined) {
        throw new Error();
    }

    const confirmPassword = req.body.confirm_password;
    if (confirmPassword === undefined) {
        throw new Error();
    }
    try {
        const session = await userSystem.signUp(email, password);
        req.session.sid = session.id;
        console.info(`Started session <${session.id}> with for <${email}>`);

        const i18n = req.i18n;
        const verifyLink = fullyQualifiedLinkTo({ where: "signUpVerify", token: session.token! });
        await mailer.send({
            from: {
                email: env("MAILTRAP_SENDER"),
                name: i18n.t('accounts.verificationEmailFrom'),
            },
            to: [
                {
                    email
                }
            ],
            subject: i18n.t("accounts.verificationEmailSubject"),
            text: i18n.t("accounts.verificationEmailBody", { verifyLink, interpolation: { escapeValue: false } }),
            category: "Outside Weather Logins"
        });

        const deps = await makeDeps({ req });
        const resp = renderSignUp({ deps, email, message: 'verificationEmailSent' });
        res.status(401).type('html').send(resp);
    } catch (err) {
        if (UserSystemError.is(err, 'duplicateEmail')) {
            const deps = await makeDeps({ req });
            const resp = renderSignUp({ deps, email, message: 'duplicateEmail' });
            res.status(401).type('html').send(resp);
        } else {
            throw err;
        }
    }
}

async function getVerify(
    { userSystem }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    if (typeof req.query.token !== 'string') {
        throw new Error();
    }
    const account = req.userAccount;
    if (account === undefined) {
        res.redirect(linkTo({ where: "index" }));
        return;
    }
    await userSystem.verifyEmail(account.sessionID, account.email, req.query.token);

    const returnTo = proveString(req.query["returnto"]);
    if (returnTo !== undefined) {
        res.redirect(returnTo);
    } else {
        res.redirect(linkTo({ where: "index" }));
    }
}

async function getForgotPassword(
    { }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const email = proveString(req.query['email']);
    const deps = await makeDeps({ req });
    const resp = renderForgotPassword({ deps, email });
    res.type('html').send(resp);
}

async function postForgotPassword(
    { }: UserRouteOptions,
    req: Request<{ email?: string }>,
    res: Response
): Promise<void> {
    throw new Error("Unimplemented");
}

async function getSettings(
    { userSystem }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const userAccount = req.userAccount;
    if (userAccount === undefined) {
        res.redirect(linkTo({ where: "index" }));
        return;
    }
    const deps = await makeDeps({ req });
    const resp = renderAccountSettings({ deps, userAccount });
    res.type('html').send(resp);
}

export function AccountRoutes(options: UserRouteOptions) {
    return Router()
        .get('/sign-in', async (req, res) => {
            await getSignIn(options, req, res);
        })
        .post('/sign-in', urlencoded({ extended: true }), async (req, res) => {
            await postSignIn(options, req, res);
        })
        .get('/sign-out', async (req, res) => {
            await getSignOut(options, req, res);
        })
        .get('/sign-up', async (req, res) => {
            await getSignUp(options, req, res);
        })
        .post('/sign-up', urlencoded({ extended: true }), async (req, res) => {
            await postSignUp(options, req, res);
        })
        .get('/sign-up/verify', async (req, res) => {
            await getVerify(options, req, res);
        })
        .get('/forgot-password', async (req, res) => {
            await getForgotPassword(options, req, res);
        })
        .post('/forgot-password', urlencoded({ extended: true }), async (req, res) => {
            await postForgotPassword(options, req, res);
        })
        .get('/account', async (req, res) => {
            await getSettings(options, req, res);
        });
}
