import { Test, TestingModule } from '@nestjs/testing';

import { mockUsers } from './users-mock.data';
import { UsersService } from '../users.service';
import { ViewUserDto } from '../entities/user.entity';
import { UserMetadata } from '../../../shared/metadata/user.metadata';
import { sortObjects } from 'src/shared/utils/sort.util';
import { ERROR_MESSAGES, writeError } from 'src/shared/utils/error.util';

describe('UsersService', () => {
    let service: UsersService;

    const metadata = UserMetadata;
    const mockData: ViewUserDto[] = sortObjects(mockUsers, metadata.sortBy);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        service['data'] = [];
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Find Users', () => {
        it('should return an empty array initially', () => {
            expect(service.findAll()).toEqual([]);
        });

        it('should return multiple users after creation', () => {
            mockData.forEach((req) => {
                service.create(req);
            });

            const retList = service.findAll();
            expect(retList.length).toBe(mockData.length);
            expect(retList).toMatchObject(mockData);
        });
    });

    describe('Find Single User', () => {
        it('should return a specific user from one user', () => {
            const retKeyName = service.create(mockData[0])[metadata.keyName];
            expect(retKeyName).toMatch(mockData[0][metadata.keyName]);

            const retItem = service.findOne(retKeyName);
            expect(retKeyName).toMatch(retItem[metadata.keyName]);
            expect(retItem).toMatchObject(mockData[0]);
        });

        it('should throw an error when trying to retrieve a user from zero users', () => {
            const keyParam = 'unknownuser';
            expect(() => service.findOne(keyParam)).toThrow(
                writeError(metadata, ERROR_MESSAGES.NOT_FOUND, keyParam)
            );
        });

        it('should throw an error when trying to retrieve a user with unknown upn', () => {
            service.create(mockData[0]);

            const keyParam = 'unknownuser';
            expect(() => service.findOne(keyParam)).toThrow(
                writeError(metadata, ERROR_MESSAGES.NOT_FOUND, keyParam)
            );
        });
    });

    describe('Find Users with Filters', () => {
        beforeEach(() => {
            mockUsers.forEach((req) => service.create(req));
        });

        it('should return users matching the filter criteria', () => {
            const filter = { lastName: mockUsers[0].lastName };
            const filteredUsers = service.findAll(filter);

            expect(filteredUsers.length).toBe(1);
            expect(filteredUsers[0]).toMatchObject(mockUsers[0]);
        });

        it('should return an empty array if no users match the filter criteria', () => {
            const filter = { email: 'nonexistent@example.com' };
            const filteredUsers = service.findAll(filter);

            expect(filteredUsers.length).toBe(0);
        });
    });

    describe('Create User', () => {
        it('should create and return a new user', () => {
            const ret = service.create(mockData[0]);
            expect(ret).toMatchObject(mockData[0]);
        });

        it('should create multiple users one-by-one', () => {
            mockData.forEach((req) => {
                const ret = service.create(req);
                expect(ret).toMatchObject(req);
            });
        });

        it('should correctly set createdDate and updatedDate when a new user is created', () => {
            const ret = service.create(mockData[0]);

            expect(ret.createdDate).toBeDefined();
            expect(ret.updatedDate).toBeDefined();
            expect(ret.createdDate).toBe(ret.updatedDate);

            expect(() => new Date(ret.createdDate).toISOString()).not.toThrow();
            expect(() => new Date(ret.updatedDate).toISOString()).not.toThrow();
        });

        it('should throw an error when creating a user with a key value that already exists', () => {
            service.create(mockData[0]);
            expect(() => service.create(mockData[0])).toThrow(
                writeError(
                    metadata,
                    ERROR_MESSAGES.EXISTS,
                    mockData[0][metadata.keyName]
                )
            );
        });
    });

    describe('Update User', () => {
        it('should update and return the updated user', () => {
            const originalItem = service.create(mockData[0]);
            const updateData = { firstName: 'Updated Name' };

            const updatedUser = service.update(
                originalItem[metadata.keyName],
                updateData
            );

            expect(updatedUser.firstName).toBe(updateData.firstName);
            expect(updatedUser.email).toBe(originalItem.email); // unchanged
        });

        it('should throw an error when trying to update a non-existent user', () => {
            const updateData = { firstName: 'Non-existent Item' };
            const keyParam = 'unknownuser';

            expect(() => service.update(keyParam, updateData)).toThrow(
                writeError(metadata, ERROR_MESSAGES.NOT_FOUND, keyParam)
            );
        });
    });

    describe('Delete User', () => {
        it('should delete a user and return void', () => {
            console.log(service.findAll());

            const retKeyName = service.create(mockData[0])[metadata.keyName];

            service.delete(retKeyName);

            expect(() => service.findOne(retKeyName)).toThrow(
                writeError(metadata, ERROR_MESSAGES.NOT_FOUND, retKeyName)
            );
        });

        it('should throw an error when trying to delete a non-existent user', () => {
            const keyParam = 'unknownuser';

            expect(() => service.delete(keyParam)).toThrow(
                writeError(metadata, ERROR_MESSAGES.NOT_FOUND, keyParam)
            );
        });
    });
});
