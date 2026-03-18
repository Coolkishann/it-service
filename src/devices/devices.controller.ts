import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('devices')
export class DevicesController {

  constructor(private devicesService: DevicesService) { }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() body: any) {
    return this.devicesService.create(body);
  }

  @Get()
  findAll() {
    return this.devicesService.findAll({});
  }
}