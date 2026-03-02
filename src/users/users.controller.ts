import { Controller, Patch, Param, Body } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Patch('change-role/:id')
    @Roles(Role.SUPER_ADMIN)
    changeRole(
        @Param('id') id: string,
        @Body('role') role: Role,
    ) {
        return this.usersService.changeRole(+id, role);
    }
}
