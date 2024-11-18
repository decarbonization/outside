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
import { proveString } from "../utilities/maybe";
import { makeDeps } from "../views/_deps";
import { linkTo } from "./_links";

export interface UserRouteOptions {
    readonly userSystem: UserSystem;
    readonly mailer: MailtrapClient;
}

async function getSignIn(
    { }: UserRouteOptions,
    req: Request,
    res: Response
): Promise<void> {
    const deps = await makeDeps({ req });
    const resp = renderSignIn({ deps });
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
        res.redirect("/");
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
    const session = req.sessionModel;
    if (session !== undefined) {
        await userSystem.signOut(session.id);
        req.session.sid = undefined;
        console.info(`Ended session <${session}>`);
    }
    const returnTo = proveString(req.query["returnto"]);
    if (returnTo !== undefined) {
        res.redirect(returnTo);
    } else {
        res.redirect(linkTo({ where: "index" }));
    }
}

export function AccountRoutes(options: UserRouteOptions) {
    return Router()
        .get('/sign-in', async (req, res) => {
            await getSignIn(options, req, res);
        })
        .post('/sign-in', urlencoded({ extended: true, parameterLimit: 1 }), async (req, res) => {
            await postSignIn(options, req, res);
        })
        .get('/sign-out', async (req, res) => {
            await getSignOut(options, req, res);
        });
}
