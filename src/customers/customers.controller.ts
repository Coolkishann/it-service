import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CustomersService } from './customers.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { OfficeGuard } from '../common/guards/office.guard';

@Controller('customers')
export class CustomersController {

  constructor(private customersService: CustomersService) {}

  // CREATE CUSTOMER
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() body: any) {
    return this.customersService.create(body);
  }

  // VIEW CUSTOMERS (office restricted)
  @UseGuards(OfficeGuard)
  @Get()
  findAll(@Req() req) {
    return this.customersService.findAll(req.officeFilter);
  }
}