import { Role } from '@/common/enums/role.enum';
import { Role as RoleEntity } from '@/entities/roles/role.entity';
import { User } from '@/entities/users/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../entities/user-role/user-role.entity';
import { UsersRolesService } from './users-roles.service';

const mockUserRole: UserRole = {
  id: '1',
  role: {
    id: '1',
    name: Role.ADMIN,
    description: 'Admin role',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  user: {
    id: '1',
    username: 'testuser',
    email: 'test@gmail.com',
    password: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    userRoles: [],
  },
};

describe('UsersRolesService', () => {
  let service: UsersRolesService;
  let repository: Repository<UserRole>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRolesService,
        {
          provide: getRepositoryToken(UserRole),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersRolesService>(UsersRolesService);
    repository = module.get<Repository<UserRole>>(getRepositoryToken(UserRole));
  });

  describe('find', () => {
    it('should return an array of user roles', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockUserRole]);

      const result = await service.find();

      expect(repository.find).toHaveBeenCalledWith({
        where: undefined,
        relations: [],
      });
      expect(result).toEqual([mockUserRole]);
    });

    it('should return user roles with specific where and relations', async () => {
      const where = {
        id: '1',
        user: { id: 'user-id', username: 'testuser' } as User,
        role: {
          id: '1',
          name: Role.ADMIN,
          description: 'Admin role',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as RoleEntity,
      };

      const relations = ['users'];
      jest.spyOn(repository, 'find').mockResolvedValue([mockUserRole]);

      const result = await service.find(where, relations);

      expect(repository.find).toHaveBeenCalledWith({ where, relations });
      expect(result).toEqual([mockUserRole]);
    });
  });

  describe('insert', () => {
    it('should insert a new user role and return it', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockUserRole);

      const result = await service.insert({
        role: {
          id: '1',
          name: Role.ADMIN,
          description: 'Admin role',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      });

      expect(repository.save).toHaveBeenCalledWith({
        role: {
          id: '1',
          name: Role.ADMIN,
          description: 'Admin role',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      });
      expect(result).toEqual(mockUserRole);
    });
  });

  describe('delete', () => {
    it('should delete a user role by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUserRole);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await service.delete(mockUserRole.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockUserRole.id },
      });
      expect(repository.delete).toHaveBeenCalledWith(mockUserRole.id);
    });

    it('should throw NotFoundException if the user role is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.delete('invalid-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
