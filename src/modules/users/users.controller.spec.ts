import { Role } from '@/common/enums/role.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  username: 'test',
  password: 'pass@123',
  role: Role.ADMIN,
};
const mockUsersService = {
  find: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
  upsert: jest.fn(),
  update: jest.fn(),
  changePassword: jest.fn(),
  delete: jest.fn(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: typeof mockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      usersService.find.mockResolvedValue([mockUser]);

      const result = await usersController.findAll();

      expect(result).toEqual({ message: 'Success', data: [mockUser], statusCode: 200 });
      expect(usersService.find).toHaveBeenCalledWith({});
    });

    it('should handle errors gracefully', async () => {
      usersService.find.mockRejectedValue(new Error('Error retrieving users'));

      await expect(usersController.findAll()).rejects.toEqual({
        message: 'Error retrieving users',
        statusCode: 400,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await usersController.findOne('1');

      expect(result).toEqual({ message: 'Success', data: mockUser, statusCode: 200 });
      expect(usersService.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('should handle errors gracefully', async () => {
      usersService.findOne.mockRejectedValue(new Error('User not found'));

      await expect(usersController.findOne('1')).rejects.toEqual({
        message: 'User not found',
        statusCode: 400,
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      usersService.insert.mockResolvedValue(mockUser);

      const result = await usersController.create(mockUser);

      expect(result).toEqual({ message: 'Success', data: mockUser, statusCode: 201 });
      expect(usersService.insert).toHaveBeenCalledWith(mockUser, mockUser.role);
    });

    it('should handle errors gracefully', async () => {
      usersService.insert.mockRejectedValue(new Error('Error creating user'));

      await expect(usersController.create(mockUser)).rejects.toEqual({
        message: 'Error creating user',
        statusCode: 400,
      });
    });
  });

  describe('upsert', () => {
    it('should upsert a user', async () => {
      usersService.upsert.mockResolvedValue(undefined);

      const result = await usersController.upsert(mockUser as any, '1');

      expect(result).toEqual({ message: 'Success', data: undefined, statusCode: 200 });
      expect(usersService.upsert).toHaveBeenCalledWith(mockUser, '1');
    });

    it('should handle errors gracefully', async () => {
      usersService.upsert.mockRejectedValue(new Error('Error upserting user'));

      await expect(usersController.upsert(mockUser as any, '1')).rejects.toEqual({
        message: 'Error upserting user',
        statusCode: 400,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      usersService.update.mockResolvedValue(undefined);

      const result = await usersController.update('1', { email: 'updated@example.com' });

      expect(result).toEqual({ message: 'Updated', statusCode: 200 });
      expect(usersService.update).toHaveBeenCalledWith('1', { email: 'updated@example.com' });
    });

    it('should handle errors gracefully', async () => {
      usersService.update.mockRejectedValue(new Error('Error updating user'));

      await expect(usersController.update('1', { email: 'updated@example.com' })).rejects.toEqual({
        message: 'Error updating user',
        statusCode: 400,
      });
    });
  });

  describe('changePassword', () => {
    it('should change a user password', async () => {
      usersService.changePassword.mockResolvedValue(undefined);

      const result = await usersController.changePassword('1', { password: 'oldPassword', newPassword: 'newPassword' });

      expect(result).toEqual({ message: 'Password updated successfully', statusCode: 200 });
      expect(usersService.changePassword).toHaveBeenCalledWith('1', { password: 'oldPassword', newPassword: 'newPassword' });
    });

    it('should handle errors gracefully', async () => {
      usersService.changePassword.mockRejectedValue(new Error('Error changing password'));

      await expect(usersController.changePassword('1', { password: 'oldPassword', newPassword: 'newPassword' })).rejects.toEqual({
        message: 'Error changing password',
        statusCode: 400,
      });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      usersService.delete.mockResolvedValue(undefined);

      const result = await usersController.remove('1');

      expect(result).toEqual({ message: 'Deleted', statusCode: 200 });
      expect(usersService.delete).toHaveBeenCalledWith('1');
    });

    it('should handle errors gracefully', async () => {
      usersService.delete.mockRejectedValue(new Error('Error deleting user'));

      await expect(usersController.remove('1')).rejects.toEqual({
        message: 'Error deleting user',
        statusCode: 400,
      });
    });
  });
});