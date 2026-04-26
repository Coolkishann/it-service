import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        branch: { include: { customer: true } },
      },
    });
  }

  async findOne(id: number) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: {
        branch: true,
      },
    });
    if (!device) {
      throw new NotFoundException(`Device #${id} not found`);
    }
    return device;
  }

  async update(id: number, data: any) {
    const device = await this.prisma.device.findUnique({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Device #${id} not found`);
    }

    if (data.serialNumber && data.serialNumber !== device.serialNumber) {
      const exists = await this.prisma.device.findUnique({
        where: { serialNumber: data.serialNumber },
      });
      if (exists) {
        throw new BadRequestException('Serial number already exists');
      }
    }

    return this.prisma.device.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const device = await this.prisma.device.findUnique({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Device #${id} not found`);
    }
    return this.prisma.device.delete({
      where: { id },
    });
  }
}