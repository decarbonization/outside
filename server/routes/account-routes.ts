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
import renderAccountSettings from "../templates/renderAccountSettings";
import renderForgotPassword from "../templates/renderForgotPassword";
import renderForgotPasswordRecover from "../templates/renderForgotPasswordRecover";
import renderSignIn from "../templates/renderSignIn";
import renderSignUp from "../templates/renderSignUp";
import { env, envFlag } from "../utilities/env";
import { mapIfNotUndefined, proveString } from "../utilities/maybe";
import { makeDeps } from "../hooks/Deps";
import { fullyQualifiedLinkTo, linkTo } from "./_links";

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
    const password = req.body.password;
    try {
        if (email === undefined) {
            throw new Error("Missing email");
        }
        if (password === undefined) {
            throw new Error("Missing password");
        }
        const session = await userSystem.signIn(email, password);
        req.session.sid = session.id;
        console.info(`Started session <${session.id}> for <${email}>`);
        const returnTo = proveString(req.query["returnto"]);
        if (returnTo !== undefined) {
            res.redirect(returnTo);
        } else {
            res.redirect(linkTo({ where: "index" }));
        }
    } catch (error) {
        const deps = await makeDeps({ req });
        const resp = renderSignIn({ deps, email, error });
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
    if (envFlag("DISABLE_SIGN_UP", false)) {
        res.redirect(linkTo({ where: "index" }));
        return;
    }
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
    if (envFlag("DISABLE_SIGN_UP", false)) {
        res.redirect(linkTo({ where: "index" }));
        return;
    }
    const email = req.body.email ?? "";
    const password = req.body.password ?? "";
    const confirmPassword = req.body.confirm_password ?? "";
    try {
        if (password !== confirmPassword) {
            throw new UserSystemError('mismatchedPasswords', 'Provided passwords do not match');
        }
        const session = await userSystem.signUp(email, password);
        req.session.sid = session.id;
        console.info(`Started session <${session.id}> with for <${email}>`);

        const i18n = req.i18n;
        const verifyLink = fullyQualifiedLinkTo({ where: "signUpVerify", token: session.token! });
        await mailer.send({
            from: {
                email: env("MAILTRAP_SENDER"),
                name: i18n.t('appName'),
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
        const resp = renderSignUp({ deps, email, signedUp: true });
        res.status(401).type('html').send(resp);
    } catch (error) {
        const deps = await makeDeps({ req });
        const resp = renderSignUp({ deps, email, error });
        res.status(401).type('html').send(resp);
    }
}

async function getVerify(
    { userSystem }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const token = proveString(req.query['token']);
    const account = req.userAccount;
    if (token === undefined || account === undefined) {
        res.redirect(linkTo({ where: "index" }));
        return;
    }
    await userSystem.verifyEmail(account.sessionID, account.email, token);

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
    const deps = await makeDeps({ req });
    const resp = renderForgotPassword({ deps });
    res.type('html').send(resp);
}

async function postForgotPassword(
    { userSystem, mailer }: UserRouteOptions,
    req: Request<{ email?: string }>,
    res: Response
): Promise<void> {
    const email = req.body.email ?? "";
    try {
        const session = await userSystem.beginForgotPassword(email);
        console.info(`Started forgot password session <${session.id}> with for <${email}>`);

        const i18n = req.i18n;
        const recoverLink = fullyQualifiedLinkTo({ where: "forgotPasswordRecover", sessionID: session.id, token: session.token! });
        await mailer.send({
            from: {
                email: env("MAILTRAP_SENDER"),
                name: i18n.t('appName'),
            },
            to: [
                {
                    email
                }
            ],
            subject: i18n.t("accounts.forgotPasswordEmailSubject"),
            text: i18n.t("accounts.forgotPasswordEmailBody", { recoverLink, interpolation: { escapeValue: false } }),
            category: "Outside Weather Logins"
        });

        const deps = await makeDeps({ req });
        const resp = renderForgotPassword({ deps, email, sent: true });
        res.type('html').send(resp);
    } catch (error) {
        const deps = await makeDeps({ req });
        const resp = renderForgotPassword({ deps, email, error });
        res.status(401).type('html').send(resp);
    }
}

async function getForgotPasswordRecover(
    { }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const sessionID = mapIfNotUndefined(proveString(req.query["sid"]), sid => Number(sid));
    if (sessionID === undefined) {
        throw new Error("Missing sid");
    }
    const token = proveString(req.query["token"]);
    if (token === undefined) {
        throw new Error("Missing token");
    }
    try {
        const deps = await makeDeps({ req });
        const resp = renderForgotPasswordRecover({ deps, sessionID, token });
        res.type('html').send(resp);
    } catch (error) {
        const deps = await makeDeps({ req });
        const resp = renderForgotPasswordRecover({ deps, sessionID, token, error });
        res.status(401).type('html').send(resp);
    }
}

async function postForgotPasswordRecover(
    { userSystem }: UserRouteOptions,
    req: Request<{ password?: string, confirm_password?: string }>,
    res: Response
): Promise<void> {
    const sessionID = mapIfNotUndefined(proveString(req.query["sid"]), sid => Number(sid));
    if (sessionID === undefined) {
        throw new Error("Missing sid");
    }
    const token = proveString(req.query["token"]);
    if (token === undefined) {
        throw new Error("Missing token");
    }
    try {
        const password = req.body.password ?? "";
        const confirmPassword = req.body.confirm_password ?? "";
        if (password !== confirmPassword) {
            throw new UserSystemError('mismatchedPasswords', 'Provided passwords do not match');
        }
        const session = await userSystem.finishForgotPassword(sessionID, token, password);
        req.session.sid = session.id;
        console.info(`Started session <${session.id}> from recovered password`);
        res.redirect(linkTo({ where: "index" }));
    } catch (error) {
        const deps = await makeDeps({ req });
        const resp = renderForgotPasswordRecover({ deps, sessionID, token, error });
        res.status(401).type('html').send(resp);
    }
}

async function getSettings(
    { }: UserRouteOptions,
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
        .get('/forgot-password/recover', async (req, res) => {
            await getForgotPasswordRecover(options, req, res);
        })
        .post('/forgot-password/recover', urlencoded({ extended: true }), async (req, res) => {
            await postForgotPasswordRecover(options, req, res);
        })
        .get('/account', async (req, res) => {
            await getSettings(options, req, res);
        });
}
