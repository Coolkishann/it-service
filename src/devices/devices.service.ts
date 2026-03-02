import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class DevicesService {

  constructor(private prisma: PrismaService) {}

  async create(data: any) {

    const exists = await this.prisma.device.findUnique({
      where: { serialNumber: data.serialNumber },
    });

    if (exists) {
      throw new Error('Serial number already exists');
    }

    return this.prisma.device.create({
      data,
    });
  }

  findAll(filter: any) {
    return this.prisma.device.findMany({
      where: filter,
      include: {
        branch: true,
      },
    });
  }
}