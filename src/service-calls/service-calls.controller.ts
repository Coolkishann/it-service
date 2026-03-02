import { Controller, Post, Get, Body, Req, UseGuards, Param, Patch } from '@nestjs/common';
import { ServiceCallsService } from './service-calls.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { OfficeGuard } from '../common/guards/office.guard';

@Controller('service-calls')
export class ServiceCallsController {

  constructor(private service: ServiceCallsService) {}

  // Create Call
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.ENGINEER)
  create(@Body() body: any) {
    return this.service.create(body);
  }

  // View Calls (Office Restricted)
  @UseGuards(OfficeGuard)
  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.officeFilter);
  }

  // Update Status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: any,
  ) {
    return this.service.updateStatus(+id, status);
  }
}