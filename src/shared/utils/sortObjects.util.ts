export const sortObjects = (data: any, sortKeys: string[]) =>
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
