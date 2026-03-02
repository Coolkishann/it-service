import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BranchesService {

  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.branch.create({
      data,
    });
  }

  findAll(filter: any) {
    return this.prisma.branch.findMany({
      where: filter,
      include: {
        customer: true,
      },
    });
  }
}