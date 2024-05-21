/**
 * Access an environment variable, throwing an error if no value is found.
 * 
 * @param key A key which should be present in the environment.
 * @param defaultValue An optional default value for the variable.
 * @returns The value for `key`.
 */
export function env(key: string, defaultValue?: string): string {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        throw new Error(`$${key} not present in environment`);
    }
    return value;
}
