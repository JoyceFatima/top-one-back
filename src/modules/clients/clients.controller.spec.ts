import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

const mockClient = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
}

jest.mock('./clients.service');

const mockClients = [mockClient];

describe('ClientsController', () => {
  let clientsController: ClientsController;
  let clientsService: jest.Mocked<ClientsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [ClientsService],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    clientsController = module.get<ClientsController>(ClientsController);
    clientsService = module.get(ClientsService);
  });

  describe('findAll', () => {
    it('should return all clients', async () => {
      clientsService.find.mockResolvedValue(mockClients);

      const result = await clientsController.findAll();

      expect(result).toEqual({
        message: 'Success',
        data: mockClients,
        statusCode: 200,
      });
      expect(clientsService.find).toHaveBeenCalledWith({}, undefined);
    });

    it('should handle errors gracefully', async () => {
      clientsService.find.mockRejectedValue(new Error('Error fetching clients'));

      await expect(clientsController.findAll()).rejects.toEqual({
        message: 'Error fetching clients',
        statusCode: 400,
      });
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      clientsService.findOne.mockResolvedValue(mockClient);

      const result = await clientsController.findOne('1');

      expect(result).toEqual({
        message: 'Success',
        data: mockClient,
        statusCode: 200,
      });
      expect(clientsService.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('should handle errors gracefully', async () => {
      clientsService.findOne.mockRejectedValue(new Error('Client not found'));

      await expect(clientsController.findOne('1')).rejects.toEqual({
        message: 'Client not found',
        statusCode: 400,
      });
    });
  });

  describe('create', () => {
    it('should create a new client', async () => {
      clientsService.insert.mockResolvedValue(mockClient);

      const result = await clientsController.create(mockClient);

      expect(result).toEqual({
        message: 'Client created successfully',
        data: mockClient,
        statusCode: 201,
      });
      expect(clientsService.insert).toHaveBeenCalledWith(mockClient);
    });

    it('should handle errors gracefully', async () => {
      clientsService.insert.mockRejectedValue(new Error('Error creating client'));

      await expect(clientsController.create(mockClient)).rejects.toEqual({
        message: 'Error creating client',
        statusCode: 400,
      });
    });
  });

  describe('update', () => {
    it('should update a client by id', async () => {
      clientsService.update.mockResolvedValue(undefined);

      const result = await clientsController.update('1', { name: 'Updated Name' });

      expect(result).toEqual({
        message: 'Client updated successfully',
        statusCode: 200,
      });
      expect(clientsService.update).toHaveBeenCalledWith('1', {
        name: 'Updated Name',
      });
    });

    it('should handle errors gracefully', async () => {
      clientsService.update.mockRejectedValue(new Error('Error updating client'));

      await expect(
        clientsController.update('1', { name: 'Updated Name' }),
      ).rejects.toEqual({
        message: 'Error updating client',
        statusCode: 400,
      });
    });
  });

  describe('remove', () => {
    it('should delete a client by id', async () => {
      clientsService.delete.mockResolvedValue(undefined);

      const result = await clientsController.remove('1');

      expect(result).toEqual({
        message: 'Client deleted successfully',
        statusCode: 200,
      });
      expect(clientsService.delete).toHaveBeenCalledWith('1');
    });

    it('should handle errors gracefully', async () => {
      clientsService.delete.mockRejectedValue(new Error('Error deleting client'));

      await expect(clientsController.remove('1')).rejects.toEqual({
        message: 'Error deleting client',
        statusCode: 400,
      });
    });
  });
});
