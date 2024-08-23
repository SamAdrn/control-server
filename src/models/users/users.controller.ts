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
    findAll(@Query() query?: Partial<ViewUserDto>): ViewUserDto[] {
        return this.dataService.findAll(query);
    }

    @Get(':upn')
    findOne(@Param('upn') keyValue: string): ViewUserDto {
        return this.dataService.findOne(keyValue);
    }

    @Post()
    create(@Body() createItem: CreateUserDto): ViewUserDto {
        return this.dataService.create(createItem);
    }

    @Put(':upn')
    update(
        @Param('upn') keyValue: string,
        @Body() updateItem: UpdateUserDto
    ): ViewUserDto {
        return this.dataService.update(keyValue, updateItem);
    }

    @Delete(':upn')
    delete(@Param('upn') keyValue: string): void {
        return this.dataService.delete(keyValue);
    }
}
