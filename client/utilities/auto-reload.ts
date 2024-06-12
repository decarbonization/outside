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

export function autoReload(): void {
    const lastUpdatedFooter = document.querySelector<HTMLElement>(".current-forecast .last-updated");
    if (lastUpdatedFooter === null) {
        return;
    }
    const rawExpires = lastUpdatedFooter.dataset["expires"];
    if (typeof rawExpires !== 'string') {
        console.error(`.last-updated[@data-expires] ${rawExpires} is not a string`)
        return;
    }
    const expires = new Date(rawExpires);
    let isUnloading = false;
    window.addEventListener("beforeunload", () => {
        isUnloading = true;
        console.info("Leaving page, auto refresh disabled");
    });
    document.addEventListener("visibilitychange", () => {
        if (document.hidden || isUnloading) {
            return;
        }
        if (new Date() <= expires) {
            console.info(`No refresh required, data expires on ${expires}`);
            return;
        }
        window.location.reload();
    });
}