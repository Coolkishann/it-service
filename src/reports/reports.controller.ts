// src/reports/reports.controller.ts - IMPROVED VERSION
import { Controller, Get, Param, Res, Query, ParseIntPipe } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import type { Response } from "express";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/role.enum";

@Controller('reports')
export class ReportsController {
    constructor(private service: ReportsService) { }

    // Engineer Performance Report
    @Get('engineer-performance')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    getEngineerReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        return this.service.engineerReport(startDate, endDate);
    }

    // Device History
    @Get('device-history/:id')
    deviceHistory(@Param('id', ParseIntPipe) id: number) {
        return this.service.deviceHistory(id);
    }

    // Branch Report
    @Get('branch-report')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    branchReport() {
        return this.service.branchReport();
    }

    // Export Engineer Report to Excel
    @Get('engineer-excel')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    async exportEngineerExcel(@Res() res: Response) {
        const buffer = await this.service.exportEngineerExcel();

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=engineer-report-${new Date().toISOString().split('T')[0]}.xlsx`
        );

        res.send(buffer);
    }

    // NEW: Dashboard Analytics
    @Get('dashboard-analytics')
    async getDashboardAnalytics(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('officeId') officeId?: number
    ) {
        return this.service.getDashboardAnalytics(startDate, endDate, officeId);
    }

    // NEW: Service Call Trends
    @Get('service-call-trends')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    async getServiceCallTrends(
        @Query('period') period: 'day' | 'week' | 'month' = 'month',
        @Query('officeId') officeId?: number
    ) {
        return this.service.getServiceCallTrends(period, officeId);
    }

    // NEW: Device Utilization Report
    @Get('device-utilization')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    async getDeviceUtilization(@Query('officeId') officeId?: number) {
        return this.service.getDeviceUtilization(officeId);
    }

    // NEW: Export Branch Report to Excel
    @Get('branch-excel')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    async exportBranchExcel(@Res() res: Response) {
        const buffer = await this.service.exportBranchExcel();

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=branch-report-${new Date().toISOString().split('T')[0]}.xlsx`
        );

        res.send(buffer);
    }

    // NEW: Export Service Calls to Excel
    @Get('service-calls-excel')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    async exportServiceCallsExcel(
        @Res() res: Response,
        @Query('status') status?: string,
        @Query('priority') priority?: string
    ) {
        const buffer = await this.service.exportServiceCallsExcel(status, priority);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=service-calls-${new Date().toISOString().split('T')[0]}.xlsx`
        );

        res.send(buffer);
    }

    // NEW: Monthly Summary Report
    @Get('monthly-summary')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    async getMonthlySummary(
        @Query('year', ParseIntPipe) year: number,
        @Query('month', ParseIntPipe) month: number
    ) {
        return this.service.getMonthlySummary(year, month);
    }
}
