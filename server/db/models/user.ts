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

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "@sequelize/core";
import { Attribute, Default, HasMany, NotNull, PrimaryKey, Table, Unique } from '@sequelize/core/decorators-legacy';
import { UserSessionModel } from "./user-session";
import { UserSettingModel } from "./user-setting";

@Table({ tableName: "users" })
export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    @Attribute(DataTypes.STRING)
    @PrimaryKey
    @Unique
    @NotNull
    declare id: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    
    @Attribute(DataTypes.STRING)
    @NotNull
    declare email: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare password: string;
    
    @Attribute(DataTypes.BOOLEAN)
    @Default(false)
    declare isVerified: boolean;

    @Attribute(DataTypes.ARRAY(DataTypes.STRING))
    declare scopes: string[];

    @HasMany(() => UserSessionModel, /* foreign key */ 'userID')
    declare sessions?: NonAttribute<UserSessionModel[]>;

    @HasMany(() => UserSettingModel, /* foreign key */ 'userID')
    declare settings?: NonAttribute<UserSettingModel[]>;
}
