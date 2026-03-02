import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class OfficeGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // Super admin can see everything
    if (user.role === 'SUPER_ADMIN') {
      req.officeFilter = {};
      return true;
    }

    // restrict by office
    req.officeFilter = {
      officeId: user.officeId,
    };

    return true;
  }
}