import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const [totalDevices, activeCalls, activeEngineers, resolvedCalls] = await Promise.all([
            this.prisma.device.count(),
            this.prisma.serviceCall.count({
                where: {
                    status: { in: ['PENDING', 'IN_PROGRESS'] }
                }
            }),
            this.prisma.user.count({
                where: {
                    role: 'ENGINEER',
                    isActive: true
                }
            }),
            this.prisma.serviceCall.count({ where: { status: 'RESOLVED' } }),
        ]);

        return {
            totalDevices,
            activeCalls,
            activeEngineers,
            resolvedCalls,
        };
    }
}
