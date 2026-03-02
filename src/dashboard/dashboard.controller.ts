import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('dashboard')
export class DashboardController {

  @Get('super-admin')
  @Roles(Role.SUPER_ADMIN)
  superAdminDashboard() {
    return 'Super Admin Dashboard ✅';
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  adminDashboard() {
    return 'Admin Dashboard ✅';
  }

  @Get('engineer')
  @Roles(Role.ENGINEER)
  engineerDashboard() {
    return 'Engineer Dashboard ✅';
  }
}