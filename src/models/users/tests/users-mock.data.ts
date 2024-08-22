import { ViewUserDto } from '../entities/user.entity';
import { generateISODate } from 'src/shared/utils/generate.util';

export const mockUsers: ViewUserDto[] = [
    {
        firstName: 'Reza',
        lastName: 'Rahadian',
        upn: 'rezarahadian',
        email: 'reza@rahadian.com',
        createdDate: generateISODate(-2),
        updatedDate: generateISODate(-1),
    },
    {
        firstName: 'Dian',
        lastName: 'Sastrowardoyo',
        upn: 'diansastro',
        email: 'dian@sastrowardoyo.com',
        createdDate: generateISODate(-4),
        updatedDate: generateISODate(-3),
    },
    {
        firstName: 'Nicholas',
        lastName: 'Saputra',
        upn: 'nicosaputra',
        email: 'nicholas@saputra.com',
        createdDate: generateISODate(-6),
        updatedDate: generateISODate(-5),
    },
];
