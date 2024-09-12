import {
    FindManyOptions,
    FindOptionsWhere,
    LessThanOrEqual,
    MoreThanOrEqual,
    ILike,
    Not,
    FindOptionsOrder,
} from 'typeorm';

/**
 * Parses query parameters from a request and returns TypeORM FindManyOptions.
 *
 * Supported query parameter formats:
 * - property=val               : Returns all items where property equals val.
 * - property_ne=val            : Returns all items where property is not equal to val.
 * - property_before=val        : Returns all items where property (a date) is before or equal to val.
 * - property_after=val         : Returns all items where property (a date) is after or equal to val.
 * - property_contains=val      : Returns all items where property contains the substring val (case-insensitive).
 * - property_notcontain=val    : Returns all items where property does not contain the substring val (case-insensitive).
 * - property_gte=val           : Returns all items where property is greater than or equal to val.
 * - property_lte=val           : Returns all items where property is less than or equal to val.
 * - sortby_asc=property        : Returns all items sorted in ascending order based on values of property.
 * - sortby_dsc=property        : Returns all items sorted in descending order based on values of property.
 *
 * @param queryParams Object representing query parameters from the request
 * @returns FindManyOptions object to be used in TypeORM queries
 */
export function parseQueryParams<T>(
    queryParams: Record<string, any>
): FindManyOptions<T> {
    if (!queryParams) {
        return {};
    }

    const where: FindOptionsWhere<T> = {};
    const order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(queryParams)) {
        if (key.includes('_')) {
            const [property, operator] = key.split('_');

            switch (operator) {
                case 'ne': // Not equal
                    where[property] = Not(value);
                    break;
                case 'before': // Before or equal (date as ISO string)
                    where[property] = LessThanOrEqual(value);
                    break;
                case 'after': // After or equal (date as ISO string)
                    where[property] = MoreThanOrEqual(value);
                    break;
                case 'contains': // Contains substring (case-insensitive)
                    where[property] = ILike(`%${value}%`);
                    break;
                case 'notcontain': // Does not contain substring (case-insensitive)
                    where[property] = Not(ILike(`%${value}%`));
                    break;
                case 'gte': // Greater than or equal (number)
                    where[property] = MoreThanOrEqual(Number(value));
                    break;
                case 'lte': // Less than or equal (number)
                    where[property] = LessThanOrEqual(Number(value));
                    break;
                case 'asc': // Ascending order by a given property
                    order[property] = 'ASC';
                    break;
                case 'dsc': // Descending order by a given property
                    order[property] = 'DESC';
                    break;
                default: // Unknown operator, skip
                    break;
            }
        } else {
            // Handle exact match (e.g., property=val)
            where[key] = value as any;
        }
    }

    return { where, order };
}
