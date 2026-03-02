import {
    Injectable,
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class OfficeGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        // Super admin can see everything
        if (user.role === 'SUPER_ADMIN') {
            request.officeFilter = {};
            return true;
        }

        // restrict by office
        request.officeFilter = {
            officeId: user.officeId,
        };

        return true;
    }
}