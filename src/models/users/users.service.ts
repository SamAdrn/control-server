import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users: User[] = [];

    findAll(filter?: Partial<User>): User[] {
        if (!filter) {
            return this.users;
        }

        return this.users.filter((user) =>
            Object.keys(filter).every((key) => user[key] === filter[key])
        );
    }

    findOne(upn: string): User {
        const user = this.users.find((user) => user.upn === upn);
        if (!user) {
            throw new NotFoundException(`User with UPN ${upn} not found`);
        }
        return user;
    }

    create(createUserDto: CreateUserDto): User {
        const newUser: User = {
            id: uuidv4(), // Generate UUID here
            ...createUserDto,
        };
        this.users.push(newUser);
        return newUser;
    }

    update(upn: string, updateUser: Partial<User>): User {
        const user = this.findOne(upn);
        Object.assign(user, updateUser);
        return user;
    }

    delete(upn: string): void {
        const index = this.users.findIndex((user) => user.upn === upn);
        if (index === -1) {
            throw new NotFoundException(`User with UPN ${upn} not found`);
        }
        this.users.splice(index, 1);
    }
}
