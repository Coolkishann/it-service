import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { WorkUpdatesService } from './work-updates.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('work-updates')
export class WorkUpdatesController {

  constructor(private service: WorkUpdatesService) {}

  // Engineer updates work
  @Post()
  @Roles(Role.ENGINEER, Role.ADMIN)
  create(@Body() body: any) {
    return this.service.create(body);
  }

  // View history of a service call
  @Get(':callId')
  getHistory(@Param('callId') callId: string) {
    return this.service.findByCall(+callId);
  }
}