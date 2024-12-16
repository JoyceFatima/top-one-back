import { ExecutionContext, ForbiddenException } from '@nestjs/common';

import { Role } from '@/common/enums/role.enum';

import { RolesGuard } from './roles.guard';

const mockReflector = {
  getAllAndOverride: jest.fn(),
};

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;

  beforeEach(() => {
    rolesGuard = new RolesGuard(mockReflector as any);
  });

  const mockExecutionContext = (user: any): Partial<ExecutionContext> => ({
    switchToHttp: () => ({
      getRequest: jest.fn().mockReturnValue({ user }),
      getResponse: jest.fn(),
      getNext: jest.fn(),
    }),
    getHandler: jest.fn().mockReturnValue(() => {}),
    getClass: jest.fn().mockReturnValue(() => {}),
  });

  describe('canActivate', () => {
    it('should allow access if no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const context = mockExecutionContext({
        id: 'user-id',
        userRoles: [{ role: { name: Role.ADMIN } }],
      });

      const result = rolesGuard.canActivate(context as ExecutionContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        expect.any(Function),
        expect.any(Function),
      ]);
    });

    it('should allow access if user has the required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const context = mockExecutionContext({
        id: 'user-id',
        userRoles: [{ role: { name: Role.ADMIN } }],
      });

      const result = rolesGuard.canActivate(context as ExecutionContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        expect.any(Function),
        expect.any(Function),
      ]);
    });

    it('should deny access if user does not have the required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.SELLER]);

      const context = mockExecutionContext({
        id: 'user-id',
        userRoles: [{ role: { name: Role.ADMIN } }],
      });

      expect(() => rolesGuard.canActivate(context as ExecutionContext)).toThrow(
        new ForbiddenException(
          `Access denied: You need one of the following roles: [${Role.SELLER}]`,
        ),
      );
    });

    it('should deny access if user has no roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const context = mockExecutionContext({
        id: 'user-id',
        userRoles: [],
      });

      expect(() => rolesGuard.canActivate(context as ExecutionContext)).toThrow(
        new ForbiddenException(
          `Access denied: You need one of the following roles: [${Role.ADMIN}]`,
        ),
      );
    });

    it('should deny access if user is undefined', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      const context = mockExecutionContext(undefined);

      expect(() => rolesGuard.canActivate(context as ExecutionContext)).toThrow(
        new ForbiddenException(
          "Cannot read properties of undefined (reading 'userRoles')",
        ),
      );
    });
  });
});
