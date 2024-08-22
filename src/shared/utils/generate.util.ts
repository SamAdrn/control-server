/**
 * Generates an ISO formatted- string-representation of a date with a specified
 * `offset`.
 *
 * @param offset - date offset in number of days
 * @returns a date as a string in ISO format
 */
export const generateISODate = (offset: number = 0): string => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + offset);
    return currentDate.toISOString();
};
