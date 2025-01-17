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

import { i18n } from "i18next";
import { MailtrapClient } from "mailtrap";
import sendEmail from "./_sendEmail";

export interface SendVerifyEmailOptions {
    readonly mailer: MailtrapClient;
    readonly i18n: i18n;
    readonly email: string;
    readonly verifyLink: string;
}

export default async function sendVerifyEmail({
    mailer,
    i18n,
    email,
    verifyLink,
}: SendVerifyEmailOptions): Promise<void> {
    await sendEmail({
        mailer,
        i18n,
        email,
        subject: i18n.t("accounts.verificationEmailSubject"),
        text: i18n.t("accounts.verificationEmailBody", { verifyLink }),
        category: "Outside Weather Logins",
    })
}
