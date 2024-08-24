import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
    CreateUserDto,
    ViewUserDto,
    UpdateUserDto,
    User,
} from './entities/user.entity';
import { UserMetadata } from '../../shared/metadata/user.metadata';
import { Metadata } from 'src/shared/interfaces/metadata.interface';
import { ERROR } from 'src/shared/utils/error.util';
import { generateISODate } from 'src/shared/utils/generate.util';
import { sortObjects } from 'src/shared/utils/sort.util';

@Injectable()
export class UsersService {
    private data: User[];
    private metadata: Metadata;

    constructor() {
        this.data = [];
        this.metadata = UserMetadata;
    }

    findAll(filter?: Partial<ViewUserDto>): ViewUserDto[] {
        const items = sortObjects(this.data, this.metadata.sortBy);
        if (filter) {
            return items.filter((item) =>
                Object.keys(filter).every((key) => item[key] === filter[key])
            );
        }
        return items;
    }

    findOne(keyValue: string): ViewUserDto {
        const item = this.data.find(
            (datum) => datum[this.metadata.keyName] === keyValue
        );
        if (!item) {
            throw new NotFoundException(
                ERROR.NOT_FOUND(this.metadata, keyValue)
            );
        }
        return item;
    }

    create(createItem: CreateUserDto): ViewUserDto {
        try {
            this.findOne(createItem[this.metadata.keyName]);
            // if findOne doesn't throw, item exists, so throw ConflictException
            throw new ConflictException(
                ERROR.EXISTS(this.metadata, createItem[this.metadata.keyName])
            );
        } catch (err) {
            if (err instanceof NotFoundException) {
                const newItem: User = {
                    id: uuidv4(),
                    ...createItem,
                    createdDate: generateISODate(),
                    updatedDate: generateISODate(),
                };
                this.data.push(newItem);
                return newItem;
            }
            throw err;
        }
    }

    update(keyValue: string, updateItem: UpdateUserDto): ViewUserDto {
        const item = this.findOne(keyValue);
        if (!item) {
            throw new NotFoundException(
                ERROR.NOT_FOUND(this.metadata, keyValue)
            );
        }
        Object.assign(item, updateItem);
        return item;
    }

    delete(keyValue: string): void {
        const index = this.data.findIndex(
            (item) => item[this.metadata.keyName] === keyValue
        );
        if (index === -1) {
            throw new NotFoundException(
                ERROR.NOT_FOUND(this.metadata, keyValue)
            );
        }
        this.data.splice(index, 1);
    }
}
