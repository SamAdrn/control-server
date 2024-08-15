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
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(@Query() query: Partial<User>): User[] {
        return this.usersService.findAll(query);
    }

    @Get(':upn')
    findOne(@Param('upn') upn: string): User {
        return this.usersService.findOne(upn);
    }

    @Post()
    create(@Body() user: CreateUserDto): User {
        return this.usersService.create(user);
    }

    @Put(':upn')
    update(@Param('upn') upn: string, @Body() updateUser: Partial<User>): User {
        return this.usersService.update(upn, updateUser);
    }

    @Delete(':upn')
    delete(@Param('upn') upn: string): void {
        return this.usersService.delete(upn);
    }
}
