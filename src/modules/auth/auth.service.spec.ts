import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  decodeToken,
  decryptPassword,
  encryptPassword,
  generateToken,
  isTokenExpired,
} from '@/utils/funcs';

import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';

jest.mock('@/utils/funcs');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should throw an error if email and username are missing', async () => {
      const user = { password: 'password' };

      await expect(authService.login(user as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if the email is invalid', async () => {
      const user = { email: 'invalidEmail', password: 'password' };

      await expect(authService.login(user as any)).rejects.toThrow(
        new BadRequestException('Email is invalid'),
      );
    });

    it('should throw an error if the password is missing', async () => {
      const user = { email: 'test@example.com' };

      await expect(authService.login(user as any)).rejects.toThrow(
        new BadRequestException('Password is required'),
      );
    });

    it('should throw an error if user is not found', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the password is incorrect', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue({
        password: 'hashedPassword',
      });
      (decryptPassword as jest.Mock).mockReturnValue(false);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return a token and user on successful login', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      (usersService.findOne as jest.Mock).mockResolvedValue(user);
      (decryptPassword as jest.Mock).mockReturnValue(true);
      (generateToken as jest.Mock).mockReturnValue('token');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({ token: 'token', user });
    });

    it('should return a token and user on successful login with username', async () => {
      const user = { id: 1, username: 'test', password: 'hashedPassword' };
      (usersService.findOne as jest.Mock).mockResolvedValue(user);
      (decryptPassword as jest.Mock).mockReturnValue(true);
      (generateToken as jest.Mock).mockReturnValue('token');

      const result = await authService.login({
        username: 'test',
        password: 'password',
      });

      expect(result).toEqual({ token: 'token', user });
    });
  });

  describe('renewToken', () => {
    it('should return a new token if the current one is expired', async () => {
      (isTokenExpired as jest.Mock).mockReturnValue(true);
      (decodeToken as jest.Mock).mockReturnValue({ id: 1 });
      (generateToken as jest.Mock).mockReturnValue('newToken');

      const result = await authService.renewToken('expiredToken');

      expect(result).toEqual({ token: 'newToken', user: { id: 1 } });
    });

    it('should return the same token if it is not expired', async () => {
      (isTokenExpired as jest.Mock).mockReturnValue(false);
      (decodeToken as jest.Mock).mockReturnValue({ id: 1 });

      const result = await authService.renewToken('validToken');

      expect(result).toEqual({ token: 'validToken', user: { id: 1 } });
    });
  });

  describe('changePassword', () => {
    it('should throw an error if the current password is incorrect', async () => {
      (decodeToken as jest.Mock).mockReturnValue({ id: 1 });
      (usersService.findOne as jest.Mock).mockResolvedValue({
        password: 'hashedPassword',
      });
      (decryptPassword as jest.Mock).mockReturnValue(false);

      await expect(
        authService.changePassword('token', {
          password: 'wrongPassword',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update the user password successfully', async () => {
      (decodeToken as jest.Mock).mockReturnValue({ id: 1 });
      (usersService.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
      });
      (decryptPassword as jest.Mock).mockReturnValue(true);
      (encryptPassword as jest.Mock).mockReturnValue('encryptedPassword');

      await authService.changePassword('token', {
        password: 'currentPassword',
        newPassword: 'newPassword',
      });

      expect(usersService.update).toHaveBeenCalledWith(1, {
        password: 'encryptedPassword',
      });
    });
  });
});
