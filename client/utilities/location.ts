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

/**
 * Whether it's possible to determine the user's current location.
 */
const hasLocationServices = ("geolocation" in navigator);

/**
 * Check whether the user's location should be queried when reloading the page.
 * 
 * @returns Whether the user's current location should be used when reloading.
 */
function shouldUseCurrentLocationWhenReloading(): boolean {
    if (!hasLocationServices) {
        return false;
    }
    const location = new URL(window.location.href);
    const referrer = location.searchParams.get("ref");
    if (referrer === undefined) {
        return false;
    }
    return (referrer === "loc");
}

/**
 * Update whether all location buttons on the page are disabled.
 * 
 * @param disabled The new disabled state.
 */
function locationButtonsDisabled(disabled: boolean) {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".use-current-location");
    buttons.forEach(b => b.disabled = disabled);
}

/**
 * An object representing the result of attempting
 * to use the user's current location.
 */
type NavigateToForecastAtCurrentLocationResult =
    | { success: true }
    | { success: false, error: GeolocationPositionError };

/**
 * Attempt to determine the user's current location
 * and navigate to the forecast for it.
 * 
 * @param body A function to call once resolving the user's current location has finished.
 */
function navigateToForecastAtCurrentLocation(body?: (result: NavigateToForecastAtCurrentLocationResult) => void) {
    locationButtonsDisabled(true);
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        window.location.href = `/search/${latitude}/${longitude}?ref=loc`;
        locationButtonsDisabled(false);
        if (body !== undefined) {
            body({ success: true });
        }
    }, error => {
        console.error(`Could not get location: <${error.code}> ${error.message}`);
        locationButtonsDisabled(false);
        if (body !== undefined) {
            body({ success: false, error });
        }
    }, {
        enableHighAccuracy: false,
        timeout: 10_000,
    });
}

/**
 * Reload the current page, querying for an up-to-date user location if applicable.
 */
export function reloadSupportingCurrentLocation() {
    if (shouldUseCurrentLocationWhenReloading()) {
        locationButtonsDisabled(true);
        navigateToForecastAtCurrentLocation(result => {
            if (!result.success) {
                // Fallback to whatever the page's location already was.
                window.location.reload();
            }
        });
    } else {
        window.location.reload();
    }
}

export function locationButton(): void {
    if (!hasLocationServices) {
        return;
    }

    const buttons = document.querySelectorAll<HTMLButtonElement>(".use-current-location");
    for (let i = 0, length = buttons.length; i < length; i++) {
        const button = buttons[i];
        button.disabled = false;
        button.addEventListener("click", () => navigateToForecastAtCurrentLocation());
    }
}
