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

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly dataService: UsersService) {}

    @Get()
    findAll(@Query() query: Partial<User>): User[] {
        return this.dataService.findAll(query);
    }

    @Get(':upn')
    findOne(@Param('upn') keyValue: string): User {
        return this.dataService.findOne(keyValue);
    }

    @Post()
    create(@Body() createItem: CreateUserDto): User {
        return this.dataService.create(createItem);
    }

    @Put(':upn')
    update(
        @Param('upn') keyValue: string,
        @Body() updateItem: Partial<User>
    ): User {
        return this.dataService.update(keyValue, updateItem);
    }

    @Delete(':upn')
    delete(@Param('upn') keyValue: string): void {
        return this.dataService.delete(keyValue);
    }
}
