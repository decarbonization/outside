import { ComponentChildren } from "preact";
import render from "preact-render-to-string";
import { App } from "../views/_app";
import { Deps, DepsObject } from "../views/_deps";

const templatePrelude = "<!DOCTYPE html>";

export interface RenderAppOptions {
    readonly className?: string;
    readonly deps: DepsObject;
}

export function renderApp(
    { className, deps }: RenderAppOptions,
    children: ComponentChildren
): string {
    return templatePrelude + render(
        <Deps.Provider value={deps}>
            <App className={className}>
                {children}
            </App>
        </Deps.Provider>
    );
}