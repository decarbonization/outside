/**
 * Transform a value unless it is `undefined`.
 * 
 * @param value A possibly undefined value.
 * @param transform A function which will take a value and transform it into another value.
 * @returns A transformed value or `undefined` if there was no value.
 */
export function mapIfNotUndefined<T, U>(value: T | undefined, transform: (value: T) => U): U | undefined {
    if (value === undefined) {
        return undefined;
    }
    return transform(value);
}
