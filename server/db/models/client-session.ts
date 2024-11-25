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

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core";
import { Attribute, NotNull, PrimaryKey, Table, Unique } from "@sequelize/core/decorators-legacy";

@Table({ tableName: "client_sessions" })
export class ClientSessionModel extends Model<InferAttributes<ClientSessionModel>, InferCreationAttributes<ClientSessionModel>> {
    @Attribute(DataTypes.STRING)
    @PrimaryKey
    @NotNull
    @Unique
    declare id: string;

    @NotNull
    declare createdAt: CreationOptional<Date>;

    @NotNull
    declare updatedAt: CreationOptional<Date>;

    @Attribute(DataTypes.JSON)
    @NotNull
    declare data: any;
}
