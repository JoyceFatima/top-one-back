import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { verifyToken } from '@/utils/funcs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authentication token format');
    }

    const token = authHeader.substring(7);
    return this.validateToken(token, request);
  }

  private async validateToken(token: string, request: any): Promise<boolean> {
    try {
      const user = await verifyToken(token);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Token validation error: ' + error.message,
      );
    }
  }
}
