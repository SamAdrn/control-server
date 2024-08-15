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

    @Get(':id')
    findOne(@Param('id') id: string): User {
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() user: CreateUserDto): User {
        return this.usersService.create(user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUser: Partial<User>): User {
        return this.usersService.update(id, updateUser);
    }

    @Delete(':id')
    delete(@Param('id') id: string): void {
        return this.usersService.delete(id);
    }
}
