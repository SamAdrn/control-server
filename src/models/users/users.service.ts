import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
    CreateUserDto,
    ViewUserDto,
    UpdateUserDto,
    User,
} from './entities/user.entity';
import { UserMetadata } from '../../shared/metadata/user.metadata';
import { Metadata } from 'src/shared/interfaces/metadata.interface';
import { ERROR } from 'src/shared/utils/error.util';
import { sortObjects } from 'src/shared/utils/sort.util';

@Injectable()
export class UsersService {
    private metadata: Metadata<User>;
    private keyName: keyof User;

    constructor(
        @InjectRepository(User) private dataRepository: Repository<User>
    ) {
        this.metadata = UserMetadata;
        this.keyName = this.metadata.keyName;
    }

    async findAll(filter?: Partial<ViewUserDto>): Promise<ViewUserDto[]> {
        const query = filter ? { where: filter } : {};
        const items = sortObjects(
            await this.dataRepository.find(query),
            this.metadata.sortBy
        );
        return items;
    }

    async findOne(keyValue: string): Promise<ViewUserDto> {
        const query = { [this.keyName]: keyValue };
        const item = await this.dataRepository.findOneBy(query);

        if (!item) {
            throw new NotFoundException(
                ERROR.NOT_FOUND(this.metadata, keyValue)
            );
        }
        return item;
    }

    async create(createItem: CreateUserDto): Promise<ViewUserDto> {
        const query = {
            [this.keyName]: createItem[this.keyName],
        };
        const existingItem = await this.dataRepository.findOneBy(query);

        if (existingItem) {
            throw new ConflictException(
                ERROR.EXISTS(this.metadata, createItem[this.keyName])
            );
        }

        const newItem = this.dataRepository.create(createItem);
        return this.dataRepository.save(newItem);
    }

    async update(
        keyValue: string,
        updateItem: UpdateUserDto
    ): Promise<ViewUserDto> {
        const query = { [this.keyName]: keyValue };
        const item = await this.dataRepository.findOneBy(query);

        if (!item) {
            throw new NotFoundException(
                ERROR.NOT_FOUND(this.metadata, keyValue)
            );
        }

        this.dataRepository.merge(item, updateItem);
        return this.dataRepository.save(item);
    }

    async delete(keyValue: string): Promise<void> {
        const query = { [this.keyName]: keyValue };
        const item = await this.dataRepository.findOneBy(query);

        if (!item) {
            throw new NotFoundException(
                ERROR.NOT_FOUND(this.metadata, keyValue)
            );
        }

        await this.dataRepository.remove(item);
    }
}
