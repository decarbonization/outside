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

export function prettyOrthogonalScrollables(): void {
    const scrollables = document.querySelectorAll(".orthogonal-scrollable");
    for (let i = 0, length = scrollables.length; i < length; i++) {
        const scrollable = scrollables[i];
        function updateClasses() {
            const classes = scrollable.classList;
            const width = scrollable.clientWidth;
            const contentWidth = scrollable.scrollWidth;
            if (contentWidth <= width) {
                classes.remove("start", "end");
                return;
            }
            const contentOffsetX = scrollable.scrollLeft;
            if (contentOffsetX > 0) {
                classes.add("start");
            } else {
                classes.remove("start");
            }
            if (contentOffsetX < (contentWidth - width)) {
                classes.add("end");
            } else {
                classes.remove("end");
            }
        }
        scrollable.addEventListener("scroll", () => updateClasses());
        updateClasses();
    }
}
