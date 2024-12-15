import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from '@/guards/auth.guard';
import { getToken } from '@/utils/funcs';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockUser = {
  id: 'id',
  username: 'username',
  email: 'email',
  password: 'password',
  createdAt: new Date('2020-11-11'),
  updatedAt: new Date('2020-11-11'),
  deletedAt: new Date('2020-11-11'),
  userRoles: [],
};

jest.mock('@/utils/funcs', () => ({
  getToken: jest.fn(),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            renewToken: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return success response on successful login', async () => {
      const user = { username: 'test', password: 'password' };
      const loginResponse = { token: 'fake-token', user: mockUser };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse as any);

      const result = await authController.create(user);

      expect(result).toEqual({
        message: 'Success',
        data: loginResponse,
        statusCode: 200,
      });
      expect(authService.login).toHaveBeenCalledWith(user);
    });

    it('should throw an error on failed login', async () => {
      const user = { username: 'test', password: 'password' };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.create(user)).rejects.toEqual({
        message: 'Invalid credentials',
        statusCode: 400,
      });
    });
  });

  describe('renewToken', () => {
    it('should return success response on successful token renewal', async () => {
      const authHeader = 'Bearer fake-jwt-token';
      const renewedTokenResponse = {
        token: 'renewed-fake-token',
        user: mockUser,
      };

      (getToken as jest.Mock).mockReturnValue('fake-jwt-token');
      jest
        .spyOn(authService, 'renewToken')
        .mockResolvedValue(renewedTokenResponse);

      const result = await authController.renewToken(authHeader);

      expect(result).toEqual({
        message: 'Success',
        data: renewedTokenResponse,
        statusCode: 200,
      });
      expect(getToken).toHaveBeenCalledWith(authHeader);
      expect(authService.renewToken).toHaveBeenCalledWith('fake-jwt-token');
    });

    it('should throw an error on failed token renewal', async () => {
      const authHeader = 'Bearer fake-jwt-token';

      (getToken as jest.Mock).mockReturnValue('fake-jwt-token');
      jest
        .spyOn(authService, 'renewToken')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(authController.renewToken(authHeader)).rejects.toEqual(
        new Error('Invalid token'),
      );
    });
  });
});
