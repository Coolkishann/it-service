import { Controller, Get, Query, Param, Res, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import express from 'express';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get(['engineers', 'engineer-performance'])
    async getEngineerReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.reportsService.engineerReport(startDate, endDate);
    }

    @Get('device/:id')
    async getDeviceHistory(@Param('id', ParseIntPipe) id: number) {
        return this.reportsService.deviceHistory(id);
    }

    @Get(['branches', 'branch-report'])
    async getBranchReport() {
        return this.reportsService.branchReport();
    }

    @Get(['analytics', 'dashboard-analytics'])
    async getDashboardAnalytics(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.reportsService.getDashboardAnalytics(startDate, endDate);
    }

    @Get(['trends', 'service-call-trends'])
    async getServiceCallTrends(@Query('period') period: 'day' | 'week' | 'month' = 'day') {
        return this.reportsService.getServiceCallTrends(period);
    }

    @Get('utilization')
    async getDeviceUtilization() {
        return this.reportsService.getDeviceUtilization();
    }

    @Get('summary')
    async getMonthlySummary(
        @Query('year', ParseIntPipe) year: number,
        @Query('month', ParseIntPipe) month: number,
    ) {
        return this.reportsService.getMonthlySummary(year, month);
    }

    @Get('export/engineers')
    async exportEngineerExcel(@Res() res: express.Response) {
        const buffer = await this.reportsService.exportEngineerExcel();
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="engineer_report.xlsx"',
            'Content-Length': buffer.byteLength,
        });
        res.end(buffer);
    }

    @Get('export/branches')
    async exportBranchExcel(@Res() res: express.Response) {
        const buffer = await this.reportsService.exportBranchExcel();
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="branch_report.xlsx"',
            'Content-Length': buffer.byteLength,
        });
        res.end(buffer);
    }

    @Get('export/service-calls')
    async exportServiceCallsExcel(
        @Res() res: express.Response,
        @Query('status') status?: string,
        @Query('priority') priority?: string,
    ) {
        const buffer = await this.reportsService.exportServiceCallsExcel(status, priority);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="service_calls_report.xlsx"',
            'Content-Length': buffer.byteLength,
        });
        res.end(buffer);
    }
}
