import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WorkUpdatesService {

  constructor(private prisma: PrismaService) {}

  async create(data: any) {

    return this.prisma.workUpdate.create({
      data: {
        description: data.description,
        serviceCallId: data.serviceCallId,
        engineerId: data.engineerId,

        spareParts: {
          create: data.spareParts || [],
        },
      },
      include: {
        spareParts: true,
      },
    });
  }

  findByCall(callId: number) {
    return this.prisma.workUpdate.findMany({
      where: { serviceCallId: callId },
      include: {
        spareParts: true,
      },
    });
  }
}