import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ServiceCallsService {

  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    return this.prisma.serviceCall.create({
      data: {
        title: data.title || data.problem || 'Issue Reported',
        description: data.description || data.problem || 'No detailed description provided.',
        errorCode: data.errorCode,
        priority: data.priority || 'MEDIUM',
        status: data.status || 'PENDING',
        deviceId: data.deviceId,
        engineerId: data.engineerId,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
      },
      include: {
        device: {
          include: {
            branch: {
              include: {
                customer: true,
              }
            }
          }
        },
        engineer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      },
    });
  }

  async findAll(filter: any) {
    return this.prisma.serviceCall.findMany({
      where: filter,
      include: {
        device: {
          include: {
            branch: {
              include: {
                customer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  } as any
                },
              }
            }
          }
        },
        engineer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        workUpdates: {
          include: {
            spareParts: true,
            images: true,
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const serviceCall = await this.prisma.serviceCall.findUnique({
      where: { id },
      include: {
        device: {
          include: {
            branch: {
              include: {
                customer: true,
              }
            }
          }
        },
        engineer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        workUpdates: {
          include: {
            engineer: {
              select: {
                id: true,
                name: true,
              }
            },
            spareParts: true,
            images: true,
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
      },
    });

    if (!serviceCall) {
      throw new NotFoundException(`Service call #${id} not found`);
    }

    return serviceCall;
  }

  async update(id: number, data: any) {
    // Build data object carefully
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.errorCode !== undefined) updateData.errorCode = data.errorCode;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.engineerId !== undefined) updateData.engineerId = data.engineerId;
    if (data.scheduledDate !== undefined) updateData.scheduledDate = new Date(data.scheduledDate);
    if (data.resolutionNotes !== undefined) updateData.resolutionNotes = data.resolutionNotes;

    // Auto-set resolved date when status changes to RESOLVED
    if (data.status === 'RESOLVED' && !data.resolvedDate) {
      updateData.resolvedDate = new Date();
    }
    if (data.resolvedDate !== undefined) updateData.resolvedDate = new Date(data.resolvedDate);

    return this.prisma.serviceCall.update({
      where: { id },
      data: updateData,
      include: {
        device: {
          include: {
            branch: {
              include: {
                customer: true,
              }
            }
          }
        },
        engineer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      },
    });
  }

  async updateStatus(id: number, status: string) {
    const updateData: any = { status };

    // Auto-set resolved date on RESOLVED
    if (status === 'RESOLVED') {
      updateData.resolvedDate = new Date();
    }

    return this.prisma.serviceCall.update({
      where: { id },
      data: updateData,
    });
  }

  async assignEngineer(id: number, engineerId: number) {
    return this.prisma.serviceCall.update({
      where: { id },
      data: {
        engineerId,
        status: 'IN_PROGRESS',
      },
      include: {
        engineer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.serviceCall.delete({
      where: { id },
    });
  }
}