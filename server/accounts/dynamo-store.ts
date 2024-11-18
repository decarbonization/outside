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

import { DeleteItemCommand, DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { mapIfNotUndefined } from "../utilities/maybe";
import { ValidEmail } from "./email";
import { SessionModel, UserModel } from "./models";
import { HashedPassword, ValidOTP } from "./password";
import { UserQuery, AccountStore } from "./store";

export class DynamoDBAccountStore implements AccountStore {
    constructor(client: DynamoDBClient) {
        this.docClient = DynamoDBDocumentClient.from(client);
    }

    private readonly docClient: DynamoDBDocumentClient;

    async newUserID(): Promise<string> {
        return uuidv4();
    }
    
    async insertUser(user: UserModel): Promise<void> {
        const putItem = new PutCommand({
            TableName: "outside_user",
            Item: {
                Id: user.id,
                CreatedAt: user.createdAt.toUTCString(),
                Email: user.email,
                Password: user.password,
                LastModified: user.lastModified.toUTCString(),
                IsVerified: user.isVerified,
            },
        });
        const response = await this.docClient.send(putItem);
        console.info(`insertUser: ${JSON.stringify(response)}`);
    }
    
    async updateUser(user: UserModel): Promise<void> {
        const updateItem = new UpdateCommand({
            TableName: "outside_user",
            Key: {
                Id: { "S": user.id },
            },
            AttributeUpdates: {
                CreatedAt: {
                    Value: user.createdAt.toUTCString(),
                    Action: "PUT",
                },
                Email: {
                    Value: user.email,
                    Action: "PUT",
                },
                Password: {
                    Value: user.password,
                    Action: "PUT",
                },
                LastModified: {
                    Value: user.lastModified.toUTCString(),
                    Action: "PUT",
                },
                IsVerified: {
                    Value: user.isVerified,
                    Action: "PUT",
                },
            },
        });
        const response = await this.docClient.send(updateItem);
        console.info(`updateUser: ${JSON.stringify(response)}`);
    }
    
    async deleteUser(user: UserModel): Promise<void> {
        const deleteItem = new DeleteItemCommand({
            TableName: "outside_user",
            Key: {
                Id: { "S": user.id },
            },
        });
        const response = await this.docClient.send(deleteItem);
        console.info(`deleteUser: ${JSON.stringify(response)}`);
    }
    
    async getUser(query: UserQuery): Promise<UserModel | undefined> {
        let getItem: GetItemCommand;
        switch (query.by) {
            case 'id':
                getItem = new GetItemCommand({
                    TableName: "outside_user",
                    Key: {
                        Id: { "S": query.id },
                    },
                });
                break;
            case 'email':
                getItem = new GetItemCommand({
                    TableName: "outside_user",
                    Key: {
                        Email: { "S": query.email },
                    },
                });
                break;
        }
        const response = await this.docClient.send(getItem);
        console.info(`getSession: ${JSON.stringify(response)}`);
        if (response.Item === undefined) {
            return undefined;
        }
        return {
            id: response.Item.id.S!,
            createdAt: new Date(response.Item.createdAt.S!),
            email: response.Item.email.S! as ValidEmail,
            password: response.Item.password.S! as HashedPassword,
            lastModified: new Date(response.Item.lastModified.S!),
            isVerified: response.Item.isVerified.BOOL!,
        };
    }
    
    async newSessionID(): Promise<string> {
        return uuidv4();
    }
    
    async insertSession(session: SessionModel): Promise<void> {
        const putItem = new PutCommand({
            TableName: "outside_session",
            Item: {
                Id: session.id,
                CreatedAt: session.createdAt.toUTCString(),
                UserID: session.userID,
                Otp: session.otp,
                OtpExpiresAt: session.otpExpiresAt?.toUTCString(),
            },
        });
        const response = await this.docClient.send(putItem);
        console.info(`insertSession: ${JSON.stringify(response)}`);
    }
    
    async updateSession(session: SessionModel): Promise<void> {
        const updateItem = new UpdateCommand({
            TableName: "outside_session",
            Key: {
                Id: { "S": session.id },
            },
            AttributeUpdates: {
                CreatedAt: {
                    Value: session.createdAt.toUTCString(),
                    Action: "PUT",
                },
                UserID: {
                    Value: session.userID,
                    Action: "PUT",
                },
                Otp: {
                    Value: session.otp,
                    Action: session.otp !== undefined ? "PUT" : "DELETE",
                },
                OtpExpiresAt: {
                    Value: session.otpExpiresAt?.toUTCString(),
                    Action: session.otpExpiresAt !== undefined ? "PUT" : "DELETE",
                },
            },
        });
        const response = await this.docClient.send(updateItem);
        console.info(`updateSession: ${JSON.stringify(response)}`);
    }
    
    async deleteSession(sessionID: string): Promise<void> {
        const deleteItem = new DeleteItemCommand({
            TableName: "outside_session",
            Key: {
                Id: { "S": sessionID },
            },
        });
        const response = await this.docClient.send(deleteItem);
        console.info(`deleteSession: ${JSON.stringify(response)}`);
    }
    
    async getSession(sessionID: string): Promise<SessionModel | undefined> {
        const getItem = new GetItemCommand({
            TableName: "outside_session",
            Key: {
                Id: { "S": sessionID },
            },
        });
        const response = await this.docClient.send(getItem);
        console.info(`getSession: ${JSON.stringify(response)}`);
        if (response.Item === undefined) {
            return undefined;
        }
        return {
            id: response.Item.Id.S!,
            createdAt: new Date(response.Item.CreatedAt.S!),
            userID: response.Item.UserID.S!,
            otp: response.Item.Otp.S as ValidOTP,
            otpExpiresAt: mapIfNotUndefined(response.Item.OtpExpiresAt.S, s => new Date(s)),
        };
    }
}
