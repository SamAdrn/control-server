/**
 * Sorts and returns the `data` array by the key names specified in `sortKeys`.
 *
 * @param data - an array of objects
 * @param sortKeys - an array of string key names
 * @returns the `data` array sorted
 */
export const sortObjects = (data: any[], sortKeys: string[]) =>
    data.sort((a, b) => {
        for (const key of sortKeys) {
            if (a[key] > b[key]) {
                return 1;
            } else if (a[key] < b[key]) {
                return -1;
            }
        }
        return 0; // If all keys are equal
    });
