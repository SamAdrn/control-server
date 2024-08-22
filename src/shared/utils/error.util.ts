import { Metadata } from '../interfaces/metadata.interface';

/**
 * Constants the hold error messages for various error types
 */
export const ERROR_MESSAGES = {
    NOT_FOUND: 'not found',
    EXISTS: 'already exists',
};

/**
 * Generates a structured error message.
 *
 * @param metadata - metadata object to supplement information to the message
 * @param err - error message indicating the error type
 * @param keyValue - the key value that caused the error
 * @returns a string error message
 */
export const writeError = (
    metadata: Metadata,
    err: string,
    keyValue: any = undefined
): string =>
    `${metadata.label} ` +
    `${keyValue ? `with ${metadata.keyName} ${keyValue} ` : ''}` +
    err;
