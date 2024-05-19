import { camelCaseToVariable } from "./transforms";

export type DynamicClassName = string & { readonly __tag: unique symbol };

export interface DynamicClassVariables {
    readonly [key: string]: string;
}

export function dynamic(className: string): DynamicClassName {
    return className as unknown as DynamicClassName;
}

export function resolve(className: DynamicClassName, variables: DynamicClassVariables): string {
    let result = className as string;
    for (const [key, value] of Object.entries(variables)) {
        const variableName = camelCaseToVariable(key);
        result = result.replace(variableName, value);
    }
    return result;
}
