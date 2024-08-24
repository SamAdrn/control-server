import { Metadata } from '../interfaces/metadata.interface';

/**
 * Constants the hold error messages for various error types
 */
export const ERROR = {
    NOT_FOUND: (metadata: Metadata, keyValue?: any): string =>
        `${metadata.label} ${keyValue ? `with ${metadata.keyName} ${keyValue} ` : ''}not found`,

    EXISTS: (metadata: Metadata, keyValue?: any): string =>
        `${metadata.label} ${keyValue ? `with ${metadata.keyName} ${keyValue} ` : ''}already exists`,

    INVALID_QUERY_PARAM: (param: string): string =>
        `Invalid query parameter: ${param}`,
};
