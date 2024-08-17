import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4, validate as isUUID } from 'uuid';

import { mockUsers } from './users-mock.data';
import { UserMetadata } from '../user.metadata';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Metadata } from 'src/shared/interfaces/metadata.interface';
import { sortObjects } from 'src/shared/utils/sortObjects.util';

describe('UsersService', () => {
    let service: UsersService;
    let metadata: Metadata;
    let mockData: CreateUserDto[];

    beforeAll(() => {
        metadata = UserMetadata;
        mockData = sortObjects(mockUsers, metadata.sortBy);
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        service['users'] = [];
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe(`Find Users`, () => {
        it('should return an empty array initially', () => {
            expect(service.findAll()).toEqual([]);
        });

        it('should return multiple users after creation', () => {
            mockUsers.forEach((req) => {
                service.create(req);
            });

            const retList = service.findAll();
            expect(retList.length).toBe(mockUsers.length);
            expect(retList).toMatchObject(mockUsers);
        });
    });

    describe('Find Single User', () => {
        it('should return a specific user from one user', () => {
            const retKeyName = service.create(mockUsers[0]).upn;
            expect(retKeyName).toMatch(mockUsers[0].upn);

            const retItem = service.findOne(retKeyName);
            expect(retKeyName).toMatch(retItem[metadata.keyName]);
            expect(retItem).toMatchObject(mockUsers[0]);
        });

        it('should throw an error when trying to retrieve a user from zero users', () => {
            const keyParam = 'unknownuser';
            expect(() => service.findOne(keyParam)).toThrow(
                `User with ${metadata.keyName} ${keyParam} not found`
            );
        });

        it('should throw an error when trying to retrieve a user with unknown upn', () => {
            service.create(mockUsers[0]);

            const keyParam = 'unknownuser';
            expect(() => service.findOne(keyParam)).toThrow(
                `User with ${metadata.keyName} ${keyParam} not found`
            );
        });
    });

    describe('Create User', () => {
        it('should create and return a new user', () => {
            const ret = service.create(mockUsers[0]);

            expect(ret.id).toBeDefined();
            expect(isUUID(ret.id)).toBe(true);

            expect(ret).toMatchObject(mockUsers[0]);
        });

        it('should create multiple users one-by-one', () => {
            mockUsers.forEach((req) => {
                const ret = service.create(req);

                expect(ret.id).toBeDefined();
                expect(isUUID(ret.id)).toBe(true);

                expect(ret).toMatchObject(req);
            });
        });
    });
});
