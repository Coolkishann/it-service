import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ServiceCallsService {

  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.serviceCall.create({
      data: {
        problem: data.problem,
        errorCode: data.errorCode,
        deviceId: data.deviceId,
        engineerId: data.engineerId,
        officeId: data.officeId,
      },
    });
  }

  findAll(filter: any) {
    return this.prisma.serviceCall.findMany({
      where: filter,
      include: {
        device: true,
        engineer: true,
      },
    });
  }

  updateStatus(id: number, status: any) {
    return this.prisma.serviceCall.update({
      where: { id },
      data: { status },
    });
  }
}