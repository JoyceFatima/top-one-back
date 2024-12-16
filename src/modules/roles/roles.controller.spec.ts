import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '@/common/enums/role.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

const mockRole = { id: '1', name: 'Admin', description: 'Administrator role' };
const mockRolesService = {
  find: jest.fn(),
  insert: jest.fn(),
  delete: jest.fn(),
};

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: typeof mockRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: mockRolesService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    rolesController = module.get<RolesController>(RolesController);
    rolesService = module.get(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      rolesService.find.mockResolvedValue([mockRole]);

      const result = await rolesController.findAll();

      expect(result).toEqual({ message: 'Roles retrieved', data: [mockRole] });
      expect(rolesService.find).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      rolesService.find.mockRejectedValue(new Error('Error retrieving roles'));

      await expect(rolesController.findAll()).rejects.toEqual({
        message: 'Error retrieving roles',
        statusCode: 400,
      });
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      rolesService.insert.mockResolvedValue(mockRole);

      const result = await rolesController.createRole({ role: Role.ADMIN });

      expect(result).toEqual({ message: 'Role created', data: mockRole });
      expect(rolesService.insert).toHaveBeenCalledWith({ role: Role.ADMIN });
    });

    it('should handle errors gracefully', async () => {
      rolesService.insert.mockRejectedValue(new Error('Error creating role'));

      await expect(
        rolesController.createRole({ role: Role.ADMIN }),
      ).rejects.toEqual({
        message: 'Error creating role',
        statusCode: 400,
      });
    });
  });

  describe('deleteRole', () => {
    it('should delete a role by id', async () => {
      rolesService.delete.mockResolvedValue(undefined);

      const result = await rolesController.deleteRole('1');

      expect(result).toEqual({ message: 'Role deleted successfully' });
      expect(rolesService.delete).toHaveBeenCalledWith('1');
    });

    it('should handle NotFoundException gracefully', async () => {
      rolesService.delete.mockRejectedValue(
        new NotFoundException('Role not found'),
      );

      await expect(rolesController.deleteRole('1')).rejects.toEqual({
        message: 'Role not found',
        statusCode: 404,
      });
    });
  });
});
