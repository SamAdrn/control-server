import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class User {
    @IsUUID()
    id: string;

    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;
}
