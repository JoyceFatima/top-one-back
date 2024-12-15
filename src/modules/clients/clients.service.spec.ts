import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from '@/entities/clients/clients.entity';

import { ClientsService } from './clients.service';

const mockClient = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  createdAt: new Date('2020-11-11'),
  updatedAt: new Date('2020-11-11'),
  deletedAt: new Date('2020-11-11'),
};

const mockClientsRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ClientsService', () => {
  let clientsService: ClientsService;
  let clientsRepository: jest.Mocked<Repository<Client>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientsRepository,
        },
      ],
    }).compile();

    clientsService = module.get<ClientsService>(ClientsService);
    clientsRepository = module.get(getRepositoryToken(Client));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return an array of clients', async () => {
      clientsRepository.find.mockResolvedValue([mockClient]);

      const result = await clientsService.find();

      expect(result).toEqual([mockClient]);
      expect(clientsRepository.find).toHaveBeenCalledWith({
        where: undefined,
        relations: [],
      });
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      clientsRepository.findOne.mockResolvedValue(mockClient);

      const result = await clientsService.findOne({ id: '1' });

      expect(result).toEqual(mockClient);
      expect(clientsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: [],
      });
    });
  });

  describe('insert', () => {
    it('should create a new client', async () => {
      clientsRepository.findOne.mockResolvedValue(null);
      clientsRepository.create.mockReturnValue(mockClient);
      clientsRepository.save.mockResolvedValue(mockClient);

      const result = await clientsService.insert({
        email: 'test@example.com',
        name: 'Test Client',
      });

      expect(result).toEqual(mockClient);
      expect(clientsRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(clientsRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test Client',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(clientsRepository.save).toHaveBeenCalledWith(mockClient);
    });

    it('should throw an error if the client already exists', async () => {
      clientsRepository.findOne.mockResolvedValue(mockClient);

      await expect(
        clientsService.insert({
          email: 'test@example.com',
          name: 'Test Client',
        }),
      ).rejects.toThrowError('Client already exists');
    });
  });

  describe('update', () => {
    it('should update an existing client', async () => {
      clientsRepository.findOne.mockResolvedValue(mockClient);
      clientsRepository.update.mockResolvedValue(undefined);

      await clientsService.update('1', { name: 'Updated Name' });

      expect(clientsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(clientsRepository.update).toHaveBeenCalledWith('1', {
        name: 'Updated Name',
        updatedAt: expect.any(Date),
      });
    });

    it('should throw a NotFoundException if the client does not exist', async () => {
      clientsRepository.findOne.mockResolvedValue(null);

      await expect(
        clientsService.update('1', { name: 'Updated Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing client', async () => {
      clientsRepository.findOne.mockResolvedValue(mockClient);
      clientsRepository.delete.mockResolvedValue(undefined);

      await clientsService.delete('1');

      expect(clientsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(clientsRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the client does not exist', async () => {
      clientsRepository.findOne.mockResolvedValue(null);

      await expect(clientsService.delete('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
