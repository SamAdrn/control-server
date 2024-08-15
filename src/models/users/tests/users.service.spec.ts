import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4, validate as isUUID } from 'uuid';

import { mockUsers } from './users-mock.data';
import { UsersService } from '../users.service';

describe('UsersService', () => {
    let service: UsersService;

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

    describe('Find Users', () => {
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
        it('should throw an error when trying to retrieve a user from zero users', () => {
            const upnParam = 'unknownuser';
            expect(() => service.findOne(upnParam)).toThrow(
                `User with UPN ${upnParam} not found`
            );
        });

        it('should return a specific user from one user', () => {
            const retUpn = service.create(mockUsers[0]).upn;
            expect(retUpn).toMatch(mockUsers[0].upn);

            const retUser = service.findOne(retUpn);
            expect(retUpn).toMatch(retUser.upn);
            expect(retUser).toMatchObject(mockUsers[0]);
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
