import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
    IsAlpha,
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    Length,
    Matches,
} from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * The Database Entity for a User
 */
@Entity()
export class User {
    /**
     * Unique Identifier for an entity in a database
     * -- immutable, generated by database
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * ISO-formatted date string at entity creation
     * -- immutable, generated by database (at CREATE)
     */
    @CreateDateColumn({ type: 'timestamp' })
    createdDate: string;

    /**
     * ISO-formatted date string at entity modification
     * -- mutable and generated by database (at UPDATE and CREATE)
     */
    @UpdateDateColumn({ type: 'timestamp' })
    updatedDate: string;

    /**
     * Unique User Principal Name to identify a user
     * -- immutable, postable, required
     */
    @Column({ type: 'varchar', unique: true, length: 60 })
    upn: string;

    /**
     * The user's given name
     * -- mutable, postable, required
     */
    @Column({ type: 'varchar', length: 100 })
    firstName: string;

    /**
     * The user's surname
     * -- mutable, postable, required
     */
    @Column({ type: 'varchar', length: 100 })
    lastName: string;

    /**
     * The user's email address
     * -- mutable, postable, optional
     */
    @Column({ type: 'varchar', length: 100, nullable: true })
    email?: string;
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
    @IsAlpha('en-US', { message: 'First name must contain only letters' })
    @Length(1, 100)
    firstName: string;

    @IsNotEmpty()
    @IsAlpha('en-US', { message: 'Last name must contain only letters' })
    @Length(1, 100)
    lastName: string;

    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9._-]+$/, {
        message: 'UPN must be alphanumeric and can contain . _ -',
    })
    @Length(1, 60)
    upn: string;

    @IsOptional()
    @IsEmail()
    @Length(1, 100)
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
