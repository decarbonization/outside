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
import { Attribute, NotNull, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';

@Table({ tableName: "settings" })
export class SettingModel extends Model<InferAttributes<SettingModel>, InferCreationAttributes<SettingModel>> {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    @Attribute(DataTypes.STRING)
    @PrimaryKey
    @NotNull
    declare userID: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare value: string;
}