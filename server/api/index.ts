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

import { Router } from "express";
import { DepsObject } from "../bootstrap/deps";
import ErrorMiddleware from "../middleware/ErrorMiddleware";
import AccountRoutes from "./AccountRoutes";
import SearchRoutes from "./SearchRoutes";
import WeatherRoutes from "./WeatherRoutes";

export default function api(deps: DepsObject): Router {
    return Router()
        .use(AccountRoutes(deps))
        .use(SearchRoutes(deps))
        .use(WeatherRoutes(deps))
        .use(ErrorMiddleware({})); //< Must come last!;
}
