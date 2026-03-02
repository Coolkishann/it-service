import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomersService {

  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.customer.create({
      data,
    });
  }

  findAll(filter: any) {
    return this.prisma.customer.findMany({
      where: filter,
    });
  }
}