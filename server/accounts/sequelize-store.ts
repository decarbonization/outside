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

import { FindOptions, InferAttributes, Op, Sequelize } from "@sequelize/core";
import { v4 as uuidv4 } from "uuid";
import { UserSessionModel } from "../db/models/user-session";
import { UserSettingModel } from "../db/models/user-setting";
import { UserModel } from "../db/models/user";
import { ValidEmail } from "./email";
import { UserSystemError } from "./errors";
import { HashedPassword, ValidToken } from "./password";
import { SessionID, SessionSchema, SettingName, SettingSchema, UserID, UserSchema } from "./schemas";
import { AccountStore, UserQuery } from "./store";

export class SequelizeStore implements AccountStore {
    constructor(
        private readonly sequalize: Sequelize,
    ) {}

    async newUserID(): Promise<UserID> {
        return uuidv4();
    }

    async insertUser(user: UserSchema): Promise<void> {
        await UserModel.create({
            id: user.id,
            email: user.email,
            password: user.password,
            isVerified: user.isVerified,
            scopes: [],
        });
    }

    async updateUser(user: UserSchema): Promise<void> {
        await this.sequalize.transaction(async () => {
            const model = await UserModel.findOne({ where: { id: user.id } });
            if (model === null) {
                throw new UserSystemError('unknownUser', `User <${user.id}> does not exist`);
            }
            await model.update({
                email: user.email,
                password: user.password,
                isVerified: user.isVerified,
            });
        });
    }

    async deleteUser(user: UserSchema): Promise<void> {
        await this.sequalize.transaction(async () => {
            const model = await UserModel.findOne({ where: { id: user.id } });
            if (model === null) {
                throw new UserSystemError('unknownUser', `User <${user.id}> does not exist`);
            }
            await model.destroy();
        });
    }

    async getUser(query: UserQuery): Promise<UserSchema | undefined> {
        const what = ((): FindOptions<InferAttributes<UserModel>> => {
            switch (query.by) {
                case "id":
                    return { where: { id: query.id } };
                case "email":
                    return { where: { email: query.email } };
            }
        })();
        const model = await UserModel.findOne(what);
        if (model == null) {
            return undefined;
        }
        return {
            id: model.id,
            email: model.email as ValidEmail,
            password: model.password as HashedPassword,
            isVerified: model.isVerified,
        };
    }

    async newSessionID(): Promise<SessionID> {
        return uuidv4();
    }

    async insertSession(session: SessionSchema): Promise<void> {
        await UserSessionModel.create({
            id: session.id,
            userID: session.userID,
            token: session.token,
            tokenExpiresAt: session.tokenExpiresAt,
        });
    }

    async updateSession(session: SessionSchema): Promise<void> {
        await this.sequalize.transaction(async () => {
            const model = await UserSessionModel.findOne({ where: { id: session.id } });
            if (model === null) {
                throw new UserSystemError('unknownSession', `Session <${session.id}> does not exist`);
            }
            await model.update({
                token: session.token,
                tokenExpiresAt: session.tokenExpiresAt,
            });
        });
    }

    async deleteSession(sessionID: SessionID): Promise<void> {
        await this.sequalize.transaction(async () => {
            const model = await UserSessionModel.findOne({ where: { id: sessionID } });
            if (model === null) {
                throw new UserSystemError('unknownSession', `Session <${sessionID}> does not exist`);
            }
            await model.destroy();
        });
    }

    async getSession(sessionID: SessionID): Promise<SessionSchema | undefined> {
        const model = await UserSessionModel.findOne({ where: { id: sessionID } });
        if (model === null) {
            return undefined;
        }
        return {
            id: model.id,
            userID: model.userID,
            token: (model.token ?? undefined) as (ValidToken | undefined),
            tokenExpiresAt: model.tokenExpiresAt ?? undefined,
        };
    }

    async putSettings(settings: SettingSchema[]): Promise<void> {
        await this.sequalize.transaction(async () => {
            for (const { userID, name, value } of settings) {
                const existing = await UserSettingModel.findOne({ where: { userID, name } })
                if (existing !== null) {
                    await existing.update({ value });
                } else {
                    await UserSettingModel.create({
                        userID, name, value });
                }
            }
        });
    }

    async deleteSettings(userID: UserID, names: SettingName[]): Promise<Set<SettingName>> {
        return await this.sequalize.transaction(async () => {
            const deleted = new Set<SettingName>();
            const models = await UserSettingModel.findAll({ where: { userID, name: { [Op.in]: names } } });
            for (const model of models) {
                deleted.add(model.name as SettingName);
                await model.destroy();
            }
            return deleted;
        });
    }

    async getSettings(userID: UserID, names: SettingName[]): Promise<SettingSchema[]> {
        const models = await UserSettingModel.findAll({ where: { userID, name: { [Op.in]: names } } });
        return models.map(model => ({
            userID: model.userID,
            name: model.name as SettingName,
            value: model.value,
        }));
    }
}
