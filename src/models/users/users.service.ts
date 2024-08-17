import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMetadata } from './user.metadata';
import { Metadata } from 'src/shared/interfaces/metadata.interface';
import { sortObjects } from 'src/shared/utils/sortObjects.util';

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
                `${this.metadata.label} with ${this.metadata.keyName} ${keyValue} not found`
            );
        }
        return item;
    }

    create(createItem: CreateUserDto): User {
        const newItem: User = {
            id: uuidv4(), // Generate UUID here
            ...createItem,
        };
        this.data.push(newItem);
        return newItem;
    }

    update(keyValue: string, updateItem: Partial<CreateUserDto>): User {
        const item = this.findOne(keyValue);
        if (!item) {
            throw new NotFoundException(
                `${this.metadata.label} with ${this.metadata.keyName} ${keyValue} not found`
            );
        }
        Object.assign(item, updateItem);
        return item;
    }

    delete(keyValue: string): void {
        const index = this.data.findIndex((item) => item.upn === keyValue);
        if (index === -1) {
            throw new NotFoundException(
                `${this.metadata.label} with ${this.metadata.keyName} ${keyValue} not found`
            );
        }
        this.data.splice(index, 1);
    }
}
