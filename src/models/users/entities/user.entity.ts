import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
    IsAlpha,
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsUUID,
} from 'class-validator';

export class User {
    id: string; // Immutable, backend-generated

    createdDate: string; // Immutable, backend-generated

    updatedDate: string; // Immutable, backend-generated

    upn: string; // Immutable, postable, required

    firstName: string; // Mutable, postable, required

    lastName: string; // Mutable, postable, required

    email?: string; // Mutable, postable, optional
}

export class BaseUserDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsDateString()
    createdDate: string;

    @IsNotEmpty()
    @IsDateString()
    updatedDate: string;

    @IsNotEmpty()
    @IsAlpha()
    firstName: string;

    @IsNotEmpty()
    @IsAlpha()
    lastName: string;

    @IsNotEmpty()
    upn: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}

export class ViewUserDto extends OmitType(BaseUserDto, ['id'] as const) {}

export class CreateUserDto extends OmitType(ViewUserDto, [
    'createdDate',
    'updatedDate',
] as const) {}

export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ['upn'] as const)
) {}
