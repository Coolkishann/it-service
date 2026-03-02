import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BranchesService } from './branches.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { OfficeGuard } from '../common/guards/office.guard';

@Controller('branches')
export class BranchesController {

  constructor(private branchesService: BranchesService) {}

  // Create Branch
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() body: any) {
    return this.branchesService.create(body);
  }

  // Get Branches (Office Restricted)
  @UseGuards(OfficeGuard)
  @Get()
  findAll(@Req() req) {
    return this.branchesService.findAll(req.officeFilter);
  }
}