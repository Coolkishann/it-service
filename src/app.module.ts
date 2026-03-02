import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DevicesModule } from './devices/devices.module';
import { CustomersModule } from './customers/customers.module';
import { BranchesModule } from './branches/branches.module';
import { ServiceCallsModule } from './service-calls/service-calls.module';
import { WorkUpdatesModule } from './work-updates/work-updates.module';
import { UploadsModule } from './uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    DevicesModule,
    CustomersModule,
    BranchesModule,
    ServiceCallsModule,
    WorkUpdatesModule,
    UploadsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],   // ⭐ MUST BE HERE
})
export class AppModule {}