import { Module } from '@nestjs/common';
import { WorkUpdatesController } from './work-updates.controller';
import { WorkUpdatesService } from './work-updates.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkUpdatesController],
  providers: [WorkUpdatesService],
})
export class WorkUpdatesModule {}