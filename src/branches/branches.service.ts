import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });
    if (!branch) {
      throw new NotFoundException(`Branch #${id} not found`);
    }
    return branch;
  }

  async update(id: number, data: any) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch #${id} not found`);
    }
    return this.prisma.branch.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch #${id} not found`);
    }
    return this.prisma.branch.delete({
      where: { id },
    });
  }
}