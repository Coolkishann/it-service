import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class WorkUpdatesService {

  constructor(private prisma: PrismaService) {}

  async create(data: any, user: any) {
    const serviceCall = await this.prisma.serviceCall.findUnique({
      where: { id: data.serviceCallId },
    });

    if (!serviceCall) {
      throw new NotFoundException(`Service call #${data.serviceCallId} not found`);
    }

    // Authorization check: Only assigned engineer or admin can add work updates
    if (user.role === Role.ENGINEER && serviceCall.engineerId !== user.userId) {
      throw new ForbiddenException('You are not authorized to add work updates to this service call as it is assigned to another engineer.');
    }

    return this.prisma.workUpdate.create({
      data: {
        description: data.description,
        serviceCallId: data.serviceCallId,
        engineerId: user.role === Role.ENGINEER ? user.userId : (data.engineerId || user.userId),

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