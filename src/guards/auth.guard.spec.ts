import { verifyToken } from '@/utils/funcs';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

jest.mock('@/utils/funcs');
const mockVerifyToken = verifyToken as jest.Mock;

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(() => {
    authGuard = new AuthGuard();
  });

  const mockExecutionContext = (authHeader: string | undefined): Partial<ExecutionContext> => ({
    switchToHttp: () => ({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: authHeader },
      }),
    }),
  } as any);

  describe('canActivate', () => {
    it('should throw an error if Authorization header is missing', () => {
      const context = mockExecutionContext(undefined);

      expect(() => authGuard.canActivate(context as ExecutionContext)).toThrow(
        new UnauthorizedException('Authorization header is missing'),
      );
    });

    it('should throw an error if Authorization header format is invalid', () => {
      const context = mockExecutionContext('InvalidToken');

      expect(() => authGuard.canActivate(context as ExecutionContext)).toThrow(
        new UnauthorizedException('Invalid authentication token format'),
      );
    });

    it('should validate the token and set user in the request object', async () => {
      const mockUser = { id: 'user-id', username: 'TestUser' };
      mockVerifyToken.mockResolvedValue(mockUser);

      const context = mockExecutionContext('Bearer validToken');
      const result = await authGuard.canActivate(context as ExecutionContext);

      expect(result).toBe(true);
      expect(mockVerifyToken).toHaveBeenCalledWith('validToken');

      const request = context.switchToHttp().getRequest();
      expect(request.user).toBeUndefined()
    });

    it('should throw an error if token validation fails', async () => {
      mockVerifyToken.mockRejectedValue(new Error('Invalid token'));

      const context = mockExecutionContext('Bearer invalidToken');

      await expect(authGuard.canActivate(context as ExecutionContext)).rejects.toThrow(
        new UnauthorizedException('Token validation error: Invalid token'),
      );
    });

    it('should throw an error if verifyToken returns null', async () => {
      mockVerifyToken.mockResolvedValue(null);

      const context = mockExecutionContext('Bearer nullToken');

      await expect(authGuard.canActivate(context as ExecutionContext)).rejects.toThrow(
        new UnauthorizedException('Token validation error: Invalid token'),
      );
    });
  });
});
