import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    findAll(@Query('role') role?: string) {
        return this.usersService.findAll(role);
    }

    @Get(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    update(@Param('id') id: string, @Body() body: any) {
        return this.usersService.update(+id, body);
    }

    @Post()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    create(@Body() body: any) {
        return this.usersService.create(body);
    }

    @Patch('change-role/:id')
    @Roles(Role.SUPER_ADMIN)
    changeRole(
        @Param('id') id: string,
        @Body('role') role: Role,
    ) {
        return this.usersService.changeRole(+id, role);
    }
}
