import i18next, { i18n } from "i18next";
import { createContext } from "preact";
import { Theme } from "../styling/themes";

/**
 * Encapsulates the dependencies made available to components in this app.
 */
export interface DepsObject {
    /**
     * The internationalization object.
     */
    readonly i18n: i18n;

    /**
     * The currently active theme.
     */
    readonly theme: Theme;
}

/**
 * Dependencies made available to components in this app.
 */
export const Deps = createContext({
    i18n: i18next,
    theme: { name: "", links: [], icons: {} },
} as DepsObject);
