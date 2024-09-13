import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { USER_MOCK_DATA } from './users-mock.data';
import { UsersService } from '../users.service';
import { User, ViewUserDto } from '../entities/user.entity';
import { UserMetadata } from '../../../shared/metadata/user.metadata';
import { AppModule } from 'src/app.module';
import { ERROR } from 'src/shared/utils/error.util';
import { sortObjects } from 'src/shared/utils/sort.util';

import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;
    let module: TestingModule;

    const metadata = UserMetadata;
    const mockDataList: ViewUserDto[] = sortObjects(
        USER_MOCK_DATA,
        metadata.sortBy
    );
    const mockDataObj: ViewUserDto = mockDataList[0];

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    beforeEach(async () => {
        await repository.query(
            'TRUNCATE TABLE "user" RESTART IDENTITY CASCADE'
        );
    });

    afterEach(async () => {
        await repository.query(
            'TRUNCATE TABLE "user" RESTART IDENTITY CASCADE'
        );
    });

    afterAll(async () => {
        // Close the module to release database connection
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Create User', () => {
        it('should create and return a new user', async () => {
            const requestBody = mockDataObj;
            const newItem = await service.create(requestBody);
            expect(newItem).toMatchObject(requestBody);
        });

        it('should create multiple users one-by-one', async () => {
            for (const requestBody of mockDataList) {
                const newItem = await service.create(requestBody);
                expect(newItem).toMatchObject(requestBody);
            }
        });

        it('should correctly set createdDate and updatedDate when a new user is created', async () => {
            const newItem = await service.create(mockDataObj);

            // expect(newItem.createdDate).toBeDefined();
            // expect(newItem.updatedDate).toBeDefined();
            // expect(newItem.createdDate).toBe(newItem.updatedDate);

            expect(() =>
                new Date(newItem.createdDate).toISOString()
            ).not.toThrow();
            expect(() =>
                new Date(newItem.updatedDate).toISOString()
            ).not.toThrow();
        });

        it('should throw an error when creating a user with a key value that already exists', async () => {
            const requestBody = mockDataObj;
            await service.create(requestBody);

            // Repeat CREATE -- should throw error
            await expect(() => service.create(requestBody)).rejects.toThrow(
                ERROR.EXISTS(metadata, requestBody[metadata.keyName])
            );
        });
    });

    describe('Find Users', () => {
        beforeEach(async () => {
            await Promise.all(
                mockDataList.map((requestBody) => service.create(requestBody))
            );
        });

        it('should return all users', async () => {
            const items = await service.findAll();
            expect(items.length).toBe(mockDataList.length);
            expect(items).toMatchObject(mockDataList);
        });

        it('should find a user by UPN', async () => {
            const item = await service.findOne(mockDataObj[metadata.keyName]);
            expect(item).toMatchObject(mockDataObj);
        });

        it('should throw an error when finding a non-existent user', async () => {
            await expect(service.findOne('nonexistent')).rejects.toThrow(
                ERROR.NOT_FOUND(metadata, 'nonexistent')
            );
        });

        it('should return users matching an equality filter', async () => {
            const filter = { lastName: mockDataObj.lastName };
            const items = await service.findAll(filter);

            expect(items.length).toBe(1);
            expect(items[0]).toMatchObject(mockDataObj);
        });

        it('should return an empty array if no users match the filter criteria', async () => {
            const filter = { email: 'nonexistent@example.com' };
            const items = await service.findAll(filter);

            expect(items.length).toBe(0);
        });
    });

    describe('Update User', () => {
        beforeEach(async () => {
            await service.create(mockDataObj);
        });

        it('should update and return the updated user', async () => {
            const updateKey = mockDataObj[metadata.keyName];
            const updateData = { firstName: 'Updated Name' };

            const item = await service.update(updateKey, updateData);

            expect(item.firstName).toBe(updateData.firstName);
            expect(item.lastName).toBe(mockDataObj.lastName); // unchanged
        });

        it('should throw an error when trying to update a non-existent user', async () => {
            const updateKey = 'unknownuser';
            const updateData = { firstName: 'Updated Name' };

            await expect(() =>
                service.update(updateKey, updateData)
            ).rejects.toThrow(ERROR.NOT_FOUND(metadata, updateKey));
        });
    });

    describe('Delete User', () => {
        beforeEach(async () => {
            await Promise.all(
                mockDataList.map((requestBody) => service.create(requestBody))
            );
        });

        it('should delete a user and return void', async () => {
            const deleteKey = mockDataObj[metadata.keyName];
            await service.delete(deleteKey);

            await expect(() => service.findOne(deleteKey)).rejects.toThrow(
                ERROR.NOT_FOUND(metadata, deleteKey)
            );
        });

        it('should throw an error when trying to delete a non-existent user', async () => {
            const deleteKey = 'unknownuser';

            await expect(() => service.delete(deleteKey)).rejects.toThrow(
                ERROR.NOT_FOUND(metadata, deleteKey)
            );
        });
    });
});
