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

export function lastRoute() {
    if (!document.querySelector('.place-search-form')) {
        // ^^ Not signed in.
        return;
    }
    const { pathname, search } = window.location;
    if (pathname === '/' && search === '') {
        const lastRoute = localStorage.getItem("user.lastRoute");
        if (lastRoute === null) {
            return;
        }
        window.location.href = lastRoute;
    } else if (pathname.startsWith("/weather")) {
        localStorage.setItem("user.lastRoute", `${pathname}${search}`);
    }
}
