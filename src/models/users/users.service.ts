import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMetadata } from './user.metadata';
import { Metadata } from 'src/shared/interfaces/metadata.interface';
import { sortObjects } from 'src/shared/utils/sort.util';
import { ERROR_MESSAGES, writeError } from 'src/shared/utils/error.util';

@Injectable()
export class UsersService {
    private data: User[];
    private metadata: Metadata;

    constructor() {
        this.data = [];
        this.metadata = UserMetadata;
    }

    findAll(filter?: Partial<User>): User[] {
        const items = sortObjects(this.data, this.metadata.sortBy);
        if (filter) {
            return items.filter((item) =>
                Object.keys(filter).every((key) => item[key] === filter[key])
            );
        }
        return items;
    }

    findOne(keyValue: string): User {
        const item = this.data.find(
            (datum) => datum[this.metadata.keyName] === keyValue
        );
        if (!item) {
            throw new NotFoundException(
                writeError(this.metadata, ERROR_MESSAGES.NOT_FOUND, keyValue)
            );
        }
        return item;
    }

    create(createItem: CreateUserDto): User {
        try {
            this.findOne(createItem[this.metadata.keyName]);
            // if findOne doesn't throw, the item exists, so throw ConflictException
            throw new ConflictException(
                writeError(
                    this.metadata,
                    ERROR_MESSAGES.EXISTS,
                    createItem[this.metadata.keyName]
                )
            );
        } catch (err) {
            if (err instanceof NotFoundException) {
                // item not found, safe to create a new one
                const newItem: User = { id: uuidv4(), ...createItem };
                this.data.push(newItem);
                return newItem;
            }
            throw err;
        }
    }

    update(keyValue: string, updateItem: Partial<CreateUserDto>): User {
        const item = this.findOne(keyValue);
        if (!item) {
            throw new NotFoundException(
                writeError(this.metadata, ERROR_MESSAGES.NOT_FOUND, keyValue)
            );
        }
        Object.assign(item, updateItem);
        return item;
    }

    delete(keyValue: string): void {
        const index = this.data.findIndex((item) => item.upn === keyValue);
        if (index === -1) {
            throw new NotFoundException(
                writeError(this.metadata, ERROR_MESSAGES.NOT_FOUND, keyValue)
            );
        }
        this.data.splice(index, 1);
    }
}
