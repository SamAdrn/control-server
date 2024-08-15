import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class User {
    @IsUUID()
    id: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    upn: string;

    @IsEmail()
    email: string;
}
