import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Role as RoleName } from '@/common/enums/role.enum';
import { capitalize } from '@/utils/funcs';

import { Role } from '../../entities/roles/role.entity';

import { RolesService } from './roles.service';

jest.mock('@/utils/funcs');
const mockCapitalize = capitalize as jest.Mock;

const mockRole = {
  id: '1',
  name: 'Admin',
  description: 'Admin',
};
const mockRolesRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('RolesService', () => {
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Role), useValue: mockRolesRepository },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return all roles', async () => {
      mockRolesRepository.find.mockResolvedValue([mockRole]);

      const result = await rolesService.find();

      expect(result).toEqual([mockRole]);
      expect(mockRolesRepository.find).toHaveBeenCalledWith({
        where: undefined,
      });
    });

    it('should return roles based on filter criteria', async () => {
      const filter = { name: RoleName.SELLER };
      mockRolesRepository.find.mockResolvedValue([mockRole]);

      const result = await rolesService.find(filter);

      expect(result).toEqual([mockRole]);
      expect(mockRolesRepository.find).toHaveBeenCalledWith({ where: filter });
    });
  });

  describe('insert', () => {
    it('should insert a new role', async () => {
      mockCapitalize.mockReturnValue('Admin');
      mockRolesRepository.save.mockResolvedValue(mockRole);

      const result = await rolesService.insert({ role: RoleName.ADMIN });

      expect(result).toEqual(mockRole);
      expect(mockCapitalize).toHaveBeenCalledWith('admin');
      expect(mockRolesRepository.save).toHaveBeenCalledWith({
        name: 'admin',
        description: 'Admin',
      });
    });
  });

  describe('delete', () => {
    it('should delete a role by id', async () => {
      mockRolesRepository.findOne.mockResolvedValue(mockRole);
      mockRolesRepository.delete.mockResolvedValue(undefined);

      await rolesService.delete('1');

      expect(mockRolesRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockRolesRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if role not found', async () => {
      mockRolesRepository.findOne.mockResolvedValue(null);

      await expect(rolesService.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
