import { Controller, Get, Param, Res } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import express from "express";

@Controller('reports')
export class ReportsController {

    constructor(private service: ReportsService) { }

    @Get('engineer-performance')
    getEngineerReport() {
        return this.service.engineerReport();
    }

    @Get('device-history/:id')
    deviceHistory(@Param('id') id: string) {
        return this.service.deviceHistory(+id);
    }

    @Get('branch-report')
    branchReport() {
        return this.service.branchReport();
    }

    @Get('engineer-excel')
    async exportExcel(@Res() res: express.Response) {

        const buffer = await this.service.exportEngineerExcel();

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=engineer-report.xlsx'
        );

        res.send(buffer);
    }
}