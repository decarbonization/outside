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

function useCurrentLocation(button: HTMLButtonElement) {
    button.disabled = true;
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        window.location.href = `/search/${latitude}/${longitude}`;
    }, error => {
        console.error(`Could not get location: <${error.code}> ${error.message}`);
        button.disabled = false;
    }, {
        enableHighAccuracy: false,
        timeout: 10_000,
    });
}

export function locationButton(): void {
    if (!("geolocation" in navigator)) {
        return;
    }

    const buttons = document.querySelectorAll<HTMLButtonElement>(".place-search-current-location");
    for (let i = 0, length = buttons.length; i < length; i++) {
        const button = buttons[i];
        button.disabled = false;
        button.addEventListener("click", () => useCurrentLocation(button));
    }
}
