/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
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

import { json } from "body-parser";
import { Request, Response, Router } from "express";
import "i18next-http-middleware";
import { ifNotUndef } from "its-it/nullable";
import { MailtrapClient } from "mailtrap";
import { UserSystemError } from "../accounts/errors";
import { UserSystem } from "../accounts/system";
import sendForgotPasswordEmail from "../email/sendForgotPasswordEmail";
import sendVerifyEmail from "../email/sendVerifyEmail";
import "../middleware/AccountMiddleware";
import { fullyQualifiedLinkTo } from "../routes/_links";
import { proveString } from "../utilities/maybe";

type AccountChange =
    | 'password';

export interface UserRouteOptions {
    readonly userSystem: UserSystem;
    readonly mailer: MailtrapClient;
}

async function postSignIn(
    { userSystem }: UserRouteOptions,
    req: Request<object, any, { email?: string, password?: string }>,
    res: Response
): Promise<void> {
    const email = req.body.email;
    if (email === undefined) {
        throw new Error("Missing email");
    }
    const password = req.body.password;
    if (password === undefined) {
        throw new Error("Missing password");
    }
    const session = await userSystem.signIn(email, password);
    req.session.sid = session.id;
    console.info(`Started session <${session.id}> for <${email}>`);

    res.json({ id: session.userID });
}

async function postSignUp(
    { userSystem, mailer }: UserRouteOptions,
    req: Request<object, any, { email?: string, password?: string, confirm_password?: string }>,
    res: Response
): Promise<void> {
    const email = req.body.email ?? "";
    const password = req.body.password ?? "";
    const confirmPassword = req.body.confirm_password ?? "";
    if (password !== confirmPassword) {
        throw new UserSystemError('mismatchedPasswords', 'Provided passwords do not match');
    }
    const session = await userSystem.signUp(email, password);
    req.session.sid = session.id;
    console.info(`Started session <${session.id}> with for <${email}>`);

    const i18n = req.i18n;
    const verifyLink = fullyQualifiedLinkTo({ where: "signUpVerify", token: session.token! });
    await sendVerifyEmail({ mailer, i18n, email, verifyLink });

    res.json({ id: session.userID });
}

async function postVerify(
    { userSystem }: UserRouteOptions,
    req: Request<object, any, { token?: string }>,
    res: Response
): Promise<void> {
    const token = req.body.token;
    const account = req.userAccount;
    if (token === undefined || account === undefined) {
        res.status(401).json({ message: "Not signed in" });
        return;
    }
    await userSystem.verifyEmail(account.sessionID, account.email, token);

    res.json({ id: account.userID });
}

async function postForgotPassword(
    { userSystem, mailer }: UserRouteOptions,
    req: Request<{ email?: string }>,
    res: Response
): Promise<void> {
    const email = req.body.email ?? "";
    const session = await userSystem.beginForgotPassword(email);
    console.info(`Started forgot password session <${session.id}> with for <${email}>`);

    const i18n = req.i18n;
    const recoverLink = fullyQualifiedLinkTo({ where: "forgotPasswordRecover", sessionID: session.id, token: session.token! });
    await sendForgotPasswordEmail({ mailer, i18n, email, recoverLink });

    res.json({ email });
}

async function postForgotPasswordRecover(
    { userSystem }: UserRouteOptions,
    req: Request<{ password?: string, confirm_password?: string }>,
    res: Response
): Promise<void> {
    const sessionID = ifNotUndef(proveString(req.query["sid"]), sid => Number(sid));
    if (sessionID === undefined) {
        throw new Error("Missing sid");
    }
    const token = proveString(req.query["token"]);
    if (token === undefined) {
        throw new Error("Missing token");
    }

    const password = req.body.password ?? "";
    const confirmPassword = req.body.confirm_password ?? "";
    if (password !== confirmPassword) {
        throw new UserSystemError('mismatchedPasswords', 'Provided passwords do not match');
    }
    const session = await userSystem.finishForgotPassword(sessionID, token, password);
    req.session.sid = session.id;
    console.info(`Started session <${session.id}> from recovered password`);

    res.json({ id: session.userID });
}

async function getAccount(
    { }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const userAccount = req.userAccount;
    if (userAccount === undefined) {
        res.status(401).json({ message: "Not signed in" });
        return;
    }

    res.json({
        id: userAccount.userID,
        email: userAccount.email,
    });
}


async function postAccount(
    { userSystem }: UserRouteOptions,
    req: Request<{ oldPassword?: string, newPasword?: string, confirmNewPassword?: string }>,
    res: Response
): Promise<void> {
    const userAccount = req.userAccount;
    if (userAccount === undefined) {
        res.status(401).json({ message: "Not signed in" });
        return;
    }

    const changes: AccountChange[] = [];

    const oldPassword = proveString(req.body.oldPassword);
    if (oldPassword !== undefined) {
        const newPassword = proveString(req.body.newPassword);
        if (newPassword === undefined) {
            throw new Error("Missing new password");
        }
        const confirmNewPassword = proveString(req.body.confirmNewPassword);
        if (confirmNewPassword === undefined || newPassword !== confirmNewPassword) {
            throw new Error("New passwords do not match");
        }
        await userSystem.changePassword(userAccount.userID, oldPassword, newPassword);

        changes.push('password');
    }

    res.json({ id: userAccount.userID, changes });
}

export default function AccountRoutes(options: UserRouteOptions) {
    return Router()
        .post('/api/sign-in', json(), async (req, res) => {
            await postSignIn(options, req, res);
        })
        .post('/api/sign-up', json(), async (req, res) => {
            await postSignUp(options, req, res);
        })
        .post('/api/sign-up/verify', json(), async (req, res) => {
            await postVerify(options, req, res);
        })
        .post('/api/forgot-password', json(), async (req, res) => {
            await postForgotPassword(options, req, res);
        })
        .post('/api/forgot-password/recover', json(), async (req, res) => {
            await postForgotPasswordRecover(options, req, res);
        })
        .get('/api/account', async (req, res) => {
            await getAccount(options, req, res);
        })
        .post('/api/account', json(), async (req, res) => {
            await postAccount(options, req, res);
        });
}
