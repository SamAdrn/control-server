import { Test, TestingModule } from '@nestjs/testing';

import { USER_MOCK_DATA } from './users-mock.data';
import { UsersService } from '../users.service';
import { User, ViewUserDto } from '../entities/user.entity';
import { UserMetadata } from '../../../shared/metadata/user.metadata';
import { sortObjects } from 'src/shared/utils/sort.util';
import { ERROR } from 'src/shared/utils/error.util';
import { Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;
    let module: TestingModule;

    const metadata = UserMetadata;
    const mockData: ViewUserDto[] = sortObjects(
        USER_MOCK_DATA,
        metadata.sortBy
    );

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: `src/environments/.env.test.local`,
                }),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        type: 'postgres',
                        host: configService.get<string>('DATABASE_HOST'),
                        port: configService.get<number>('DATABASE_PORT'),
                        username: configService.get<string>('DATABASE_USER'),
                        password:
                            configService.get<string>('DATABASE_PASSWORD'),
                        database: configService.get<string>('DATABASE_NAME'),
                        autoLoadEntities: true,
                        synchronize: true,
                    }),
                    inject: [ConfigService],
                }),
                TypeOrmModule.forFeature([User]),
            ],
            providers: [UsersService],
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
            const requestBody = mockData[0];
            const newItem = await service.create(requestBody);
            expect(newItem).toMatchObject(requestBody);
        });

        it('should create multiple users one-by-one', async () => {
            for (const requestBody of mockData) {
                const newItem = await service.create(requestBody);
                expect(newItem).toMatchObject(requestBody);
            }
        });

        it('should correctly set createdDate and updatedDate when a new user is created', async () => {
            const newItem = await service.create(mockData[0]);

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
            const requestBody = mockData[0];
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
                mockData.map((requestBody) => service.create(requestBody))
            );
        });

        it('should return all users', async () => {
            const items = await service.findAll();
            expect(items.length).toBe(mockData.length);
            expect(items).toMatchObject(mockData);
        });

        it('should find a user by UPN', async () => {
            const item = await service.findOne(mockData[0].upn);
            expect(item).toMatchObject(mockData[0]);
        });

        it('should throw an error when finding a non-existent user', async () => {
            await expect(service.findOne('nonexistent')).rejects.toThrow(
                ERROR.NOT_FOUND(metadata, 'nonexistent')
            );
        });

        it('should return users matching a filter', async () => {
            const filter = { lastName: USER_MOCK_DATA[0].lastName };
            const items = await service.findAll(filter);

            expect(items.length).toBe(1);
            expect(items[0]).toMatchObject(USER_MOCK_DATA[0]);
        });

        it('should return an empty array if no users match the filter criteria', async () => {
            const filter = { email: 'nonexistent@example.com' };
            const items = await service.findAll(filter);

            expect(items.length).toBe(0);
        });
    });

    describe('Update User', () => {
        beforeEach(async () => {
            await Promise.all(
                mockData.map((requestBody) => service.create(requestBody))
            );
        });

        it('should update and return the updated user', async () => {
            const updateData = { firstName: 'Updated Name' };

            const item = await service.update(
                mockData[0][metadata.keyName],
                updateData
            );

            expect(item.firstName).toBe(updateData.firstName);
            expect(item.lastName).toBe(mockData[0].lastName); // unchanged
        });

        it('should throw an error when trying to update a non-existent user', async () => {
            const updateData = { firstName: 'Updated Name' };
            const keyParam = 'unknownuser';

            await expect(() =>
                service.update(keyParam, updateData)
            ).rejects.toThrow(ERROR.NOT_FOUND(metadata, keyParam));
        });
    });

    describe('Delete User', () => {
        beforeEach(async () => {
            await Promise.all(
                mockData.map((requestBody) => service.create(requestBody))
            );
        });

        it('should delete a user and return void', async () => {
            const keyToDelete = mockData[0][metadata.keyName];
            await service.delete(keyToDelete);

            await expect(() => service.findOne(keyToDelete)).rejects.toThrow(
                ERROR.NOT_FOUND(metadata, keyToDelete)
            );
        });

        it('should throw an error when trying to delete a non-existent user', async () => {
            const keyToDelete = 'unknownuser';

            await expect(() => service.delete(keyToDelete)).rejects.toThrow(
                ERROR.NOT_FOUND(metadata, keyToDelete)
            );
        });
    });
});
