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

@Controller('branches')
export class BranchesController {

  constructor(private branchesService: BranchesService) { }

  // Create Branch
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() body: any) {
    return this.branchesService.create(body);
  }

  @Get()
  findAll() {
    return this.branchesService.findAll({});
  }
}