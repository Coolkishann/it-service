import { Module } from '@nestjs/common';
import { ServiceCallsController } from './service-calls.controller';
import { ServiceCallsService } from './service-calls.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceCallsController],
  providers: [ServiceCallsService],
})
export class ServiceCallsModule {}
