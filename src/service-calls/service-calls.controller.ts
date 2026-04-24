import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Request } from '@nestjs/common';
import { ServiceCallsService } from './service-calls.service';

@Controller('service-calls')
export class ServiceCallsController {
    constructor(private readonly serviceCallsService: ServiceCallsService) { }

    @Post()
    create(@Body() createServiceCallDto: any) {
        return this.serviceCallsService.create(createServiceCallDto);
    }

    @Get()
    findAll(@Query() filter: any, @Request() req: any) {
        return this.serviceCallsService.findAll(filter, req.user);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.serviceCallsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateServiceCallDto: any, @Request() req: any) {
        return this.serviceCallsService.update(id, updateServiceCallDto, req.user);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
        @Request() req: any,
    ) {
        return this.serviceCallsService.updateStatus(id, status, req.user);
    }

    @Patch(':id/assign')
    assignEngineer(
        @Param('id', ParseIntPipe) id: number,
        @Body('engineerId', ParseIntPipe) engineerId: number,
    ) {
        return this.serviceCallsService.assignEngineer(id, engineerId);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.serviceCallsService.delete(id);
    }
}
