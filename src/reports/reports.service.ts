import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {

    constructor(private prisma: PrismaService) { }

    async engineerReport() {

        const engineers = await this.prisma.user.findMany({
            where: {
                role: 'ENGINEER',
            },
            include: {
                assignedCalls: true,
            },
        });

        return engineers.map(engineer => {

            const total = engineer.assignedCalls.length;

            const resolved = engineer.assignedCalls.filter(
                c => c.status === 'RESOLVED',
            ).length;

            const pending = engineer.assignedCalls.filter(
                c => c.status === 'PENDING',
            ).length;

            return {
                engineer: engineer.name,
                totalCalls: total,
                resolved,
                pending,
            };
        });
    }
    async deviceHistory(deviceId: number) {

        return this.prisma.device.findUnique({
            where: { id: deviceId },
            include: {
                serviceCalls: {
                    include: {
                        workUpdates: {
                            include: {
                                spareParts: true,
                            },
                        },
                    },
                },
            },
        });

    }

    async branchReport() {

        return this.prisma.branch.findMany({
            include: {
                customer: true,
                devices: true,
            },
        });

    }


    async exportEngineerExcel() {

        const engineers = await this.engineerReport();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Engineer Report');

        sheet.columns = [
            { header: 'Engineer', key: 'engineer', width: 20 },
            { header: 'Total Calls', key: 'totalCalls', width: 15 },
            { header: 'Resolved', key: 'resolved', width: 15 },
            { header: 'Pending', key: 'pending', width: 15 },
        ];

        engineers.forEach(e => {
            sheet.addRow(e);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
}