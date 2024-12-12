import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../common/enums/role.enum';
import { IRole } from './interfaces/roles.dto';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

const result = {
  id: '1',
  name: Role.ADMIN,
  description: 'Admin role',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            find: jest.fn(),
            insert: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesController = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      jest.spyOn(rolesService, 'find').mockResolvedValue([result]);

      expect(await rolesController.findAll()).toBe(result);
    });
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const role: IRole = { role: Role.ADMIN };

      jest.spyOn(rolesService, 'insert').mockResolvedValue(result);

      expect(await rolesController.createRole(role)).toBe(result);
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      jest.spyOn(rolesService, 'delete').mockResolvedValue();

      expect(await rolesController.deleteRole('1')).toEqual({
        message: 'Role deleted successfully',
      });
    });
  });
});
