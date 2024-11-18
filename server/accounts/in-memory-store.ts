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

import { SessionModel, SessionQuery, UserModel, UserQuery, UserStore } from "./store";
import uuid from "uuid";

export interface InMemoryUserStoreOptions {
    readonly users?: UserModel[]
}

export class InMemoryUserStore implements UserStore {
    constructor({ users = [] }: InMemoryUserStoreOptions = {}) {
        this.users = users;
        this.sessions = [];
    }

    private readonly users: UserModel[];
    private readonly sessions: SessionModel[];

    async newUserID(): Promise<string> {
        return uuid.v4();
    }

    async insertUser(user: UserModel): Promise<void> {
        this.users.push({ ...user });
    }
    
    async updateUser(user: UserModel): Promise<void> {
        const toUpdate = this.users.findIndex(c => c.id === user.id);
        if (toUpdate === -1) {
            throw new Error(`User <${user.id}> does not exist`);
        }
        this.users[toUpdate] = { ...user };
    }
    
    async deleteUser(user: UserModel): Promise<void> {
        const toUpdate = this.users.findIndex(c => c.id === user.id);
        if (toUpdate === -1) {
            throw new Error(`User <${user.id}> does not exist`);
        }
        this.users.splice(toUpdate, 1);
    }

    async getUser(query: UserQuery): Promise<UserModel | undefined> {
        const user = this.users.find(userQueryPredicate(query));
        if (user === undefined) {
            throw new Error(`User for <${JSON.stringify(query)}> does not exist`);
        }
        return { ...user };
    }

    async newSessionID(): Promise<string> {
        return uuid.v4();
    }

    async insertSession(session: SessionModel): Promise<void> {
        this.sessions.push({ ...session });
    }
    
    async updateSession(session: SessionModel): Promise<void> {
        const toUpdate = this.sessions.findIndex(c => c.id === session.id);
        if (toUpdate === -1) {
            throw new Error(`Session <${session.id}> does not exist`);
        }
        this.sessions[toUpdate] = { ...session };
    }
    
    async deleteSession(query: SessionQuery): Promise<void> {
        const toDelete = this.sessions.findIndex(sessionQueryPredicate(query));
        if (toDelete === undefined) {
            throw new Error(`Session for <${JSON.stringify(query)}> does not exist`);
        }
        this.sessions.splice(toDelete, 1);
    }

    async getSession(query: SessionQuery): Promise<SessionModel | undefined> {
        const session = this.sessions.find(sessionQueryPredicate(query));
        if (session === undefined) {
            throw new Error(`Session for <${JSON.stringify(query)}> does not exist`);
        }
        return { ...session };
    }
}

function userQueryPredicate(query: UserQuery): (user: UserModel) => boolean {
    switch (query.by) {
        case 'id':
            return user => user.id === query.id;
        case 'email':
            return user => user.email === query.email;
    }
}

function sessionQueryPredicate(query: SessionQuery): (session: SessionModel) => boolean {
    switch (query.by) {
        case 'id':
            return session => session.id === query.id;
        case 'userID':
            return session => session.userID === query.userID;
    }
}
