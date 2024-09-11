import { User } from 'src/models/users/entities/user.entity';
import { Metadata } from 'src/shared/interfaces/metadata.interface';

export const UserMetadata: Metadata<User> = {
    name: 'user',
    namePlural: 'users',
    label: 'User',
    labelPlural: 'Users',
    description: 'Represents a user within the system',
    keyName: 'upn',
    sortBy: ['lastName', 'firstName'],
};
