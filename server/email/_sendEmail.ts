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

import { i18n } from "i18next";
import { MailtrapClient } from "mailtrap";
import { env } from "../utilities/env";

export interface SendEmailOptions {
    readonly mailer: MailtrapClient;
    readonly i18n: i18n;
    readonly email: string;
    readonly subject: string;
    readonly text: string;
    readonly category: string;
}

export default async function sendEmail({
    mailer,
    i18n,
    email,
    subject,
    text,
    category,
}: SendEmailOptions): Promise<void> {
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
        subject,
        text,
        category,
    });
}
