/**
 * Convert a string containing a geographic coordinate into a number.
 * 
 * @throws `TypeError` if `subject` is not a valid finite number.
 * @param subject A string containing a geographic coordinate.
 * @returns A numeric geographic coordinate.
 */
export function coordinate(subject: string): number {
    const coordinate = parseFloat(subject);
    if (!Number.isFinite(coordinate)) {
        throw new TypeError(`<${subject}> is not a valid coordinate`);
    }
    return coordinate;
}
