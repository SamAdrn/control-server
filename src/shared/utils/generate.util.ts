export const generateISODate = (offset: number = 0): string => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + offset);
    return currentDate.toISOString();
};
