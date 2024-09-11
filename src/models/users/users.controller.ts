import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
} from '@nestjs/common';

import {
    CreateUserDto,
    UpdateUserDto,
    ViewUserDto,
} from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly dataService: UsersService) {}

    @Get()
    async findAll(
        @Query() query?: Partial<ViewUserDto>
    ): Promise<ViewUserDto[]> {
        return await this.dataService.findAll(query);
    }

    @Get(':upn')
    async findOne(@Param('upn') keyValue: string): Promise<ViewUserDto> {
        return await this.dataService.findOne(keyValue);
    }

    @Post()
    async create(@Body() createItem: CreateUserDto): Promise<ViewUserDto> {
        return await this.dataService.create(createItem);
    }

    @Put(':upn')
    async update(
        @Param('upn') keyValue: string,
        @Body() updateItem: UpdateUserDto
    ): Promise<ViewUserDto> {
        return await this.dataService.update(keyValue, updateItem);
    }

    @Delete(':upn')
    async delete(@Param('upn') keyValue: string): Promise<void> {
        return await this.dataService.delete(keyValue);
    }
}
