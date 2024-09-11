/**
 * Represents the metadata information an object needs
 */
export interface Metadata<T> {
    name: string;
    namePlural: string;
    label: string;
    labelPlural: string;
    description: string;
    keyName: keyof T;
    sortBy: Array<keyof T>;
}
