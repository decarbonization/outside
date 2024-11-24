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
import { Attribute, NotNull, PrimaryKey, Table, Unique } from '@sequelize/core/decorators-legacy';

@Table({ tableName: "user_sessions" })
export class UserSessionModel extends Model<InferAttributes<UserSessionModel>, InferCreationAttributes<UserSessionModel>> {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    
    @Attribute(DataTypes.STRING)
    @PrimaryKey
    @Unique
    @NotNull
    declare id: string;
    
    @Attribute(DataTypes.STRING)
    @NotNull
    declare userID: string;
    
    @Attribute(DataTypes.STRING)
    declare token: string | null;

    @Attribute(DataTypes.DATE)
    declare tokenExpiresAt: Date | null;

    @Attribute(DataTypes.ARRAY(DataTypes.STRING))
    declare tokenScopes: string[] | null;
}
