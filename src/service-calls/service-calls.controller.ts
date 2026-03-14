import { Controller, Post, Get, Body, Req, UseGuards, Param, Patch, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ServiceCallsService } from './service-calls.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { OfficeGuard } from '../common/guards/office.guard';
import { CreateServiceCallDto, UpdateServiceCallDto } from '../all-dtos';

@Controller('service-calls')
export class ServiceCallsController {

  constructor(private service: ServiceCallsService) { }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.ENGINEER)
  create(@Body() body: CreateServiceCallDto) {
    return this.service.create(body);
  }

  // View All Calls (Office Restricted)
  @UseGuards(OfficeGuard)
  @Get()
  findAll(@Req() req: any, @Query('status') status?: string, @Query('priority') priority?: string) {
    const filter: any = { ...req.officeFilter };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    return this.service.findAll(filter);
  }

  // View Single Call
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // Update Call
  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateServiceCallDto,
  ) {
    return this.service.update(id, body);
  }

  // Update Status Only
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.service.updateStatus(id, status);
  }

  // Assign Engineer
  @Patch(':id/assign')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  assignEngineer(
    @Param('id', ParseIntPipe) id: number,
    @Body('engineerId', ParseIntPipe) engineerId: number,
  ) {
    return this.service.assignEngineer(id, engineerId);
  }

  // Delete Call
  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}