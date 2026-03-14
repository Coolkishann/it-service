// src/reports/reports.service.ts - ENHANCED VERSION
import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    // Engineer Performance Report (Enhanced)
    async engineerReport(startDate?: string, endDate?: string) {
        const where: any = { role: 'ENGINEER' };

        const engineers = await this.prisma.user.findMany({
            where,
            include: {
                assignedCalls: {
                    where: {
                        ...(startDate && endDate ? {
                            createdAt: {
                                gte: new Date(startDate),
                                lte: new Date(endDate),
                            }
                        } : {})
                    },
                    include: {
                        workUpdates: true,
                    }
                },
            },
        });

        return (engineers as any[]).map(engineer => {
            const total = engineer.assignedCalls.length;
            const resolved = engineer.assignedCalls.filter((c: any) => c.status === 'RESOLVED').length;
            const pending = engineer.assignedCalls.filter((c: any) => c.status === 'PENDING').length;
            const inProgress = engineer.assignedCalls.filter((c: any) => c.status === 'IN_PROGRESS' || c.status === 'UNDER_OBSERVATION').length;

            // Calculate total hours worked
            const totalHours = engineer.assignedCalls.reduce((sum: number, call: any) => {
                const callHours = (call.workUpdates || []).reduce((callSum: number, update: any) =>
                    callSum + (Number(update.hoursWorked) || 0), 0);
                return sum + callHours;
            }, 0);

            // Calculate resolution rate
            const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0';

            // Calculate average resolution time
            const resolvedCalls = engineer.assignedCalls.filter((c: any) => c.resolvedDate);
            const avgResolutionTime = resolvedCalls.length > 0
                ? resolvedCalls.reduce((sum: number, call: any) => {
                    const days = Math.ceil(
                        (new Date(call.resolvedDate!).getTime() - new Date(call.createdAt).getTime())
                        / (1000 * 60 * 60 * 24)
                    );
                    return sum + days;
                }, 0) / resolvedCalls.length
                : 0;

            return {
                engineerId: engineer.id,
                name: engineer.name,
                totalCalls: total,
                resolved,
                pending,
                inProgress,
                totalHoursWorked: parseFloat(totalHours.toFixed(2)),
                resolutionRate: `${resolutionRate}%`,
                avgResolutionDays: parseFloat(avgResolutionTime.toFixed(1)),
                isActive: !!engineer.isActive,
            };
        });
    }

    // Device History (Already exists, keeping as is)
    async deviceHistory(deviceId: number) {
        return this.prisma.device.findUnique({
            where: { id: deviceId },
            include: {
                branch: {
                    include: {
                        customer: true,
                    }
                },
                serviceCalls: {
                    include: {
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
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
            },
        });
    }

    // Branch Report (Enhanced)
    async branchReport() {
        const branches = await this.prisma.branch.findMany({
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                },
                devices: {
                    include: {
                        serviceCalls: {
                            where: {
                                status: {
                                    in: ['PENDING', 'IN_PROGRESS']
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        devices: true,
                    }
                }
            },
        });

        return (branches as any[]).map(branch => {
            const totalDevices = branch._count?.devices || 0;
            const activeDevices = (branch.devices || []).filter(d => d.status === 'ACTIVE').length;
            const faultyDevices = (branch.devices || []).filter(d => d.status === 'FAULTY').length;
            const openServiceCalls = (branch.devices || []).reduce((sum, device) =>
                sum + (device.serviceCalls?.length || 0), 0);

            return {
                branchId: branch.id,
                branchName: branch.name,
                branchAddress: `${branch.address || ''}, ${branch.city || ''}, ${branch.state || ''}`.trim(),
                customerName: branch.customer?.name || 'N/A',
                customerContact: branch.customer?.email || branch.customer?.phone || 'N/A',
                totalDevices,
                activeDevices,
                faultyDevices,
                openServiceCalls,
                contactPerson: branch.contactPerson || 'N/A',
                phone: branch.phone || 'N/A',
            };
        });
    }

    // Export Engineer Report to Excel
    async exportEngineerExcel() {
        const engineers = await this.engineerReport();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Engineer Performance');

        // Set column widths and headers
        sheet.columns = [
            { header: 'Engineer Name', key: 'engineerName', width: 25 },
            { header: 'Email', key: 'engineerEmail', width: 30 },
            { header: 'Total Calls', key: 'totalCalls', width: 15 },
            { header: 'Resolved', key: 'resolved', width: 15 },
            { header: 'In Progress', key: 'inProgress', width: 15 },
            { header: 'Pending', key: 'pending', width: 15 },
            { header: 'Total Hours', key: 'totalHoursWorked', width: 15 },
            { header: 'Resolution Rate', key: 'resolutionRate', width: 18 },
            { header: 'Avg Days to Resolve', key: 'avgResolutionDays', width: 20 },
            { header: 'Status', key: 'isActive', width: 12 },
        ];

        // Style header row
        sheet.getRow(1).font = { bold: true, size: 12 };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' },
        };
        sheet.getRow(1).font = { ...sheet.getRow(1).font, color: { argb: 'FFFFFFFF' } };

        // Add data rows
        engineers.forEach(engineer => {
            sheet.addRow({
                ...engineer,
                isActive: engineer.isActive ? 'Active' : 'Inactive',
            });
        });

        // Add borders
        sheet.eachRow((row, rowNumber) => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    // NEW: Dashboard Analytics
    async getDashboardAnalytics(startDate?: string, endDate?: string, officeId?: number) {
        const where: any = {};
        if (officeId) where.officeId = officeId;
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        const [
            totalDevices,
            activeDevices,
            faultyDevices,
            totalServiceCalls,
            pendingCalls,
            inProgressCalls,
            resolvedCalls,
            totalEngineers,
            activeEngineers,
            totalCustomers,
        ] = await Promise.all([
            this.prisma.device.count({ where: officeId ? { officeId } : {} }),
            this.prisma.device.count({ where: { ...where, status: 'ACTIVE' } }),
            this.prisma.device.count({ where: { ...where, status: 'FAULTY' } }),
            this.prisma.serviceCall.count({ where }),
            this.prisma.serviceCall.count({ where: { ...where, status: 'PENDING' } }),
            this.prisma.serviceCall.count({ where: { ...where, status: 'IN_PROGRESS' } }),
            this.prisma.serviceCall.count({ where: { ...where, status: 'RESOLVED' } }),
            this.prisma.user.count({ where: { role: 'ENGINEER', ...(officeId ? { officeId } : {}) } }),
            this.prisma.user.count({ where: { role: 'ENGINEER', isActive: true, ...(officeId ? { officeId } : {}) } }),
            this.prisma.customer.count({ where: officeId ? { officeId } : {} }),
        ]);

        return {
            devices: {
                total: totalDevices,
                active: activeDevices,
                faulty: faultyDevices,
                maintenance: totalDevices - activeDevices - faultyDevices,
            },
            serviceCalls: {
                total: totalServiceCalls,
                pending: pendingCalls,
                inProgress: inProgressCalls,
                resolved: resolvedCalls,
            },
            engineers: {
                total: totalEngineers,
                active: activeEngineers,
                inactive: totalEngineers - activeEngineers,
            },
            customers: {
                total: totalCustomers,
            },
        };
    }

    // NEW: Service Call Trends
    async getServiceCallTrends(period: 'day' | 'week' | 'month', officeId?: number) {
        const where: any = {};
        if (officeId) where.officeId = officeId;

        // Get last 30 days/weeks/months based on period
        const serviceCalls = await this.prisma.serviceCall.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            select: {
                createdAt: true,
                status: true,
                priority: true,
            }
        });

        // Group by period
        const groupedData = new Map();

        (serviceCalls as any[]).forEach(call => {
            const date = new Date(call.createdAt);
            let key: string;

            if (period === 'day') {
                key = date.toISOString().split('T')[0];
            } else if (period === 'week') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
            } else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }

            if (!groupedData.has(key)) {
                groupedData.set(key, {
                    period: key,
                    total: 0,
                    pending: 0,
                    inProgress: 0,
                    resolved: 0,
                    critical: 0,
                    high: 0,
                });
            }

            const data: any = groupedData.get(key);
            data.total++;
            if (call.status === 'PENDING') data.pending++;
            if (call.status === 'IN_PROGRESS' || call.status === 'UNDER_OBSERVATION') data.inProgress++;
            if (call.status === 'RESOLVED') data.resolved++;
            if (call.priority === 'CRITICAL') data.critical++;
            if (call.priority === 'HIGH') data.high++;
        });

        return Array.from(groupedData.values());
    }

    // NEW: Device Utilization Report
    async getDeviceUtilization(officeId?: number) {
        const where: any = {};
        if (officeId) where.officeId = officeId;

        const devices = await this.prisma.device.findMany({
            where,
            include: {
                serviceCalls: {
                    select: {
                        status: true,
                        createdAt: true,
                        resolvedDate: true,
                    }
                },
                branch: {
                    select: {
                        name: true,
                        customer: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        });

        return (devices as any[]).map(device => {
            const totalCalls = (device.serviceCalls || []).length;
            const openCalls = (device.serviceCalls || []).filter((c: any) =>
                c.status === 'PENDING' || c.status === 'IN_PROGRESS' || c.status === 'UNDER_OBSERVATION').length;

            // Calculate uptime percentage (simplified)
            const daysSinceInstallation = device.installationDate
                ? Math.ceil((Date.now() - new Date(device.installationDate).getTime()) / (1000 * 60 * 60 * 24))
                : 0;

            const resolvedCalls = (device.serviceCalls || []).filter((c: any) => c.resolvedDate);
            const downtimeDays = resolvedCalls.reduce((sum: number, call: any) => {
                const days = Math.ceil(
                    (new Date(call.resolvedDate!).getTime() - new Date(call.createdAt).getTime())
                    / (1000 * 60 * 60 * 24)
                );
                return sum + days;
            }, 0);

            const uptimePercentage = daysSinceInstallation > 0
                ? ((daysSinceInstallation - downtimeDays) / daysSinceInstallation * 100).toFixed(1)
                : '100';

            return {
                deviceId: device.id,
                serialNumber: device.serialNumber,
                category: device.category,
                company: device.company,
                model: device.model,
                branchName: device.branch?.name || 'N/A',
                customerName: device.branch?.customer?.name || 'N/A',
                status: device.status,
                totalServiceCalls: totalCalls,
                openServiceCalls: openCalls,
                daysSinceInstallation,
                estimatedDowntimeDays: downtimeDays,
                uptimePercentage: `${uptimePercentage}%`,
                warrantyStatus: device.warrantyExpiry
                    ? (new Date(device.warrantyExpiry) > new Date() ? 'Active' : 'Expired')
                    : 'N/A',
            };
        });
    }

    // NEW: Export Branch Report to Excel
    async exportBranchExcel() {
        const branches = await this.branchReport();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Branch Report');

        sheet.columns = [
            { header: 'Branch Name', key: 'branchName', width: 25 },
            { header: 'Address', key: 'branchAddress', width: 40 },
            { header: 'Customer', key: 'customerName', width: 25 },
            { header: 'Contact Person', key: 'contactPerson', width: 20 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Total Devices', key: 'totalDevices', width: 15 },
            { header: 'Active Devices', key: 'activeDevices', width: 15 },
            { header: 'Faulty Devices', key: 'faultyDevices', width: 15 },
            { header: 'Open Service Calls', key: 'openServiceCalls', width: 20 },
        ];

        // Style header
        sheet.getRow(1).font = { bold: true, size: 12 };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' },
        };
        sheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } };

        branches.forEach(branch => sheet.addRow(branch));

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    // NEW: Export Service Calls to Excel
    async exportServiceCallsExcel(status?: string, priority?: string) {
        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const serviceCalls = await this.prisma.serviceCall.findMany({
            where,
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
                engineer: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Service Calls');

        sheet.columns = [
            { header: 'Call ID', key: 'id', width: 10 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Device', key: 'device', width: 25 },
            { header: 'Customer', key: 'customer', width: 25 },
            { header: 'Branch', key: 'branch', width: 20 },
            { header: 'Engineer', key: 'engineer', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Priority', key: 'priority', width: 12 },
            { header: 'Created Date', key: 'createdAt', width: 15 },
            { header: 'Scheduled Date', key: 'scheduledDate', width: 15 },
            { header: 'Resolved Date', key: 'resolvedDate', width: 15 },
        ];

        // Style header
        sheet.getRow(1).font = { bold: true, size: 12 };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' },
        };
        sheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } };

        (serviceCalls as any[]).forEach(call => {
            sheet.addRow({
                id: call.id,
                title: call.title || (call as any).problem || 'N/A',
                device: `${call.device?.company || ''} ${call.device?.model || ''}`,
                customer: call.device?.branch?.customer?.name || 'N/A',
                branch: call.device?.branch?.name || 'N/A',
                engineer: call.engineer?.name || 'Unassigned',
                status: call.status,
                priority: call.priority,
                createdAt: new Date(call.createdAt).toLocaleDateString(),
                scheduledDate: call.scheduledDate ? new Date(call.scheduledDate).toLocaleDateString() : 'N/A',
                resolvedDate: call.resolvedDate ? new Date(call.resolvedDate).toLocaleDateString() : 'N/A',
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    // NEW: Monthly Summary Report
    async getMonthlySummary(year: number, month: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const where = {
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        };

        const [
            newServiceCalls,
            resolvedServiceCalls,
            newCustomers,
            newDevices,
            totalWorkUpdates,
        ] = await Promise.all([
            this.prisma.serviceCall.count({ where }),
            this.prisma.serviceCall.count({
                where: {
                    resolvedDate: {
                        gte: startDate,
                        lte: endDate,
                    }
                }
            }),
            this.prisma.customer.count({ where }),
            this.prisma.device.count({ where }),
            this.prisma.workUpdate.count({ where }),
        ]);

        return {
            year,
            month,
            summary: {
                newServiceCalls,
                resolvedServiceCalls,
                newCustomers,
                newDevices,
                totalWorkUpdates,
                resolutionRate: newServiceCalls > 0
                    ? `${((resolvedServiceCalls / newServiceCalls) * 100).toFixed(1)}%`
                    : '0%',
            }
        };
    }
}
