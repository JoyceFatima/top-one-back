import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@/common/enums/role.enum';
import { User } from '@/entities/users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const hasRole = requiredRoles.some((role) =>
      user.userRoles.some((userRole) => userRole.role.name === role),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: You need one of the following roles: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
