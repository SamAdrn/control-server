import { Metadata } from '../interfaces/metadata.interface';

export const ERROR_MESSAGES = {
    NOT_FOUND: 'not found',
    EXISTS: 'already exists',
};

export const writeError = (
    metadata: Metadata,
    err: string,
    keyValue: any = undefined
): string =>
    `${metadata.label} ` +
    `${keyValue ? `with ${metadata.keyName} ${keyValue} ` : ''}` +
    err;
