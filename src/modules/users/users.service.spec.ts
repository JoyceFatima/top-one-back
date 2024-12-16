import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { decryptPassword, encryptPassword } from '@/utils/funcs';

import { User } from '../../entities/users/user.entity';
import { RolesService } from '../roles/roles.service';
import { UsersRolesService } from '../users-roles/users-roles.service';

import { UsersService } from './users.service';

jest.mock('@/utils/funcs');
const mockEncryptPassword = encryptPassword as jest.Mock;
const mockDecryptPassword = decryptPassword as jest.Mock;

const mockUser = {
  id: '1',
  email: 'test@example.com',
  password: 'hashedPassword',
  userRoles: [{ id: 'role1', name: 'Admin' }],
};
const mockUsersRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockRolesService = {
  find: jest.fn(),
};
const mockUsersRolesService = {
  insert: jest.fn(),
  delete: jest.fn(),
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: RolesService, useValue: mockRolesService },
        { provide: UsersRolesService, useValue: mockUsersRolesService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return all users based on criteria', async () => {
      mockUsersRepository.find.mockResolvedValue([mockUser]);

      const result = await usersService.find({ email: 'test@example.com' });

      expect(result).toEqual([mockUser]);
      expect(mockUsersRepository.find).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockUsersRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(usersService.find({})).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by criteria', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.findOne({ id: '1' });

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockUsersRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usersService.findOne({})).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('insert', () => {
    it('should insert a new user', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      mockRolesService.find.mockResolvedValue([{ id: '1', name: 'Admin' }]);
      mockEncryptPassword.mockReturnValue('hashedPassword');

      await usersService.insert({
        email: 'test@test.com',
        password: 'password',
      });

      expect(mockUsersRepository.save).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'hashedPassword',
      });
      expect(mockUsersRolesService.insert).toHaveBeenCalledWith({
        user: undefined,
        role: { id: '1', name: 'Admin' },
      });
    });

    it('should throw Error if user already exists', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        usersService.insert({
          email: 'exist@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(Error);
    });

    it('should throw if not password provided', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        usersService.insert({
          email: 'test@test.com',
          password: undefined,
        }),
      ).rejects.toThrow(Error);
    });

    it('should throw NotFoundException if role not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      mockRolesService.find.mockResolvedValue([]);

      await expect(
        usersService.insert({
          email: 'test@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsert', () => {
    it('should insert a new user when no user is found by ID', async () => {
      const newUser: any = {
        id: 'new-id',
        email: 'test@example.com',
        password: 'plainPassword',
        userRoles: [{ id: 'role-id', role: { name: 'admin' } }],
      };

      mockUsersRepository.find.mockResolvedValue([]);
      mockRolesService.find.mockResolvedValue([
        { id: 'role-id', name: 'admin' },
      ]);
      mockUsersRolesService.insert.mockResolvedValue(undefined);
      mockEncryptPassword.mockReturnValue('hashedPassword');

      await usersService.upsert(newUser);

      expect(mockUsersRepository.find).toHaveBeenCalledWith({
        where: { id: undefined },
      });
      expect(mockUsersRepository.save).toHaveBeenCalledWith({
        id: 'new-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        userRoles: newUser.userRoles,
      });
      expect(mockUsersRolesService.insert).toHaveBeenCalledWith({
        role: { id: 'role-id', name: 'admin' },
      });
    });

    it('should update an existing user and reassign roles', async () => {
      const existingUser = {
        id: 'existing-id',
        email: 'existing@example.com',
        password: 'hashedPassword',
        userRoles: [{ id: 'old-role-id', role: { name: 'user' } }],
      };

      const updatedUser: any = {
        id: 'existing-id',
        email: 'updated@example.com',
        password: 'newHashedPassword',
        userRoles: [{ id: 'new-role-id', role: { name: 'admin' } }],
      };

      mockUsersRepository.find.mockResolvedValue([existingUser]);
      mockUsersRepository.save.mockResolvedValue(updatedUser);
      mockUsersRolesService.delete.mockResolvedValue(undefined);
      mockUsersRolesService.insert.mockResolvedValue(undefined);

      await usersService.upsert(updatedUser, 'existing-id');

      expect(mockUsersRepository.find).toHaveBeenCalledWith({
        where: { id: 'existing-id' },
      });
      expect(mockUsersRolesService.delete).toHaveBeenCalledWith('old-role-id');
      expect(mockUsersRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(mockUsersRolesService.insert).toHaveBeenCalledWith({
        user: updatedUser,
        role: updatedUser.userRoles[0].role,
      });
    });

    it('should handle errors gracefully', async () => {
      const newUser: any = {
        id: 'error-id',
        email: 'error@example.com',
        password: 'plainPassword',
        userRoles: [{ id: 'role-id', role: { name: 'admin' } }],
      };

      mockUsersRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(usersService.upsert(newUser)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockUsersRepository.find).toHaveBeenCalledWith({
        where: { id: undefined },
      });
      expect(mockUsersRolesService.delete).not.toHaveBeenCalled();
      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      mockUsersRepository.find.mockResolvedValue([mockUser]);

      await usersService.update('1', { email: 'updated@example.com' });

      expect(mockUsersRepository.update).toHaveBeenCalledWith('1', {
        email: 'updated@example.com',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.find.mockResolvedValue([]);

      await expect(
        usersService.update('1', { email: 'updated@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    it('should change the user password', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockDecryptPassword.mockReturnValue(true);
      mockEncryptPassword.mockReturnValue('newHashedPassword');

      await usersService.changePassword('1', {
        password: 'oldPassword',
        newPassword: 'newPassword',
      });

      expect(mockUsersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'newHashedPassword' }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        usersService.changePassword('1', {
          password: 'oldPassword',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockDecryptPassword.mockReturnValue(false);

      await expect(
        usersService.changePassword('1', {
          password: 'wrongPassword',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a user and their roles', async () => {
      mockUsersRepository.find.mockResolvedValue([mockUser]);
      mockUsersRolesService.delete.mockResolvedValue(undefined);

      await usersService.delete('1');

      expect(mockUsersRolesService.delete).toHaveBeenCalledWith('role1');
      expect(mockUsersRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.find.mockResolvedValue([]);

      await expect(usersService.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
