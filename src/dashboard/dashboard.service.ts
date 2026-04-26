import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        // Core Numbers
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

        // Recent Calls
        const recentCalls = await this.prisma.serviceCall.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                engineer: { select: { name: true } },
                device: {
                    include: { branch: { include: { customer: { select: { name: true } } } } }
                }
            }
        });

        // Bar Data: Team Performance (resolved vs pending)
        const engineers = await this.prisma.user.findMany({
            where: { role: 'ENGINEER' },
            include: {
                assignedCalls: true
            }
        });

        const barData = engineers.map(engineer => {
            const completed = engineer.assignedCalls.filter(sc => sc.status === 'RESOLVED' || sc.status === 'CLOSED').length;
            const pending = engineer.assignedCalls.filter(sc => sc.status === 'PENDING' || sc.status === 'IN_PROGRESS').length;
            return {
                engineer: engineer.name.split(' ')[0], // First name
                completed,
                pending
            };
        });

        // Line Data: Monthly Calls (last 6 months)
        const calls = await this.prisma.serviceCall.findMany({
            select: { createdAt: true }
        });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentDate = new Date();
        const lineData: { month: string; calls: number }[] = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthObj = { month: monthNames[date.getMonth()], calls: 0 };
            lineData.push(monthObj);
        }

        calls.forEach(call => {
            const d = new Date(call.createdAt);
            const m = monthNames[d.getMonth()];
            const yr = d.getFullYear();
            const matchingMonth = lineData.find(ld => ld.month === m);
            
            // basic check to ensure it falls within the last 6 months broadly
            if (matchingMonth && yr >= currentDate.getFullYear() - 1) {
                matchingMonth.calls += 1;
            }
        });

        return {
            totalDevices,
            activeCalls,
            activeEngineers,
            resolvedCalls,
            recentCalls,
            barData,
            lineData
        };
    }
}
