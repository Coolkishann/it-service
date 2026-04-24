import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {

  @Public()
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile() {
    return {
      message: 'You are authenticated ✅',
    };
  }
}