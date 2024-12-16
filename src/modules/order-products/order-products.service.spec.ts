import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Status } from '@/common/enums';
import { OrderProducts } from '@/entities/order-products/order-products.entity';

import { OrderProductsService } from './order-products.service';

const mockOrderProduct: OrderProducts = {
  id: '1',
  quantity: 2,
  order: {
    client: {
      id: 'client1',
      name: 'clientName',
      email: 'clientEmail',
      phone: 'clientPhone',
      createdAt: new Date('2020-11-11'),
      updatedAt: new Date('2020-11-11'),
      deletedAt: null,
    },
    id: 'id',
    orderProducts: [],
    status: Status.SENT,
    totalPrice: 1000,
    user: {
      id: 'userId',
      username: 'username',
      email: 'email',
      password: 'password',
      userRoles: [],
      createdAt: new Date('2020-11-11'),
      updatedAt: new Date('2020-11-11'),
      deletedAt: null,
    },
    createdAt: new Date('2020-11-11'),
    updatedAt: new Date('2020-11-11'),
    deletedAt: null,
  },
  product: {
    id: 'product1',
    name: 'productName',
    price: 100,
    stock: 10,
    category: 'productCategory',
    isActive: true,
    description: 'productDescription',
    discount: 0,
    imageUrl: 'productImageUrl',
    orderProducts: [
      {
        id: 'orderProductId',
        product: null,
        order: null,
        quantity: 2,
      },
    ],
    shoppingCart: [
      {
        id: 'shoppingCartId',
        quantity: 2,
        createdAt: new Date('2020-11-11'),
        deletedAt: null,
        updatedAt: new Date('2020-11-11'),
        product: null,
        client: {
          createdAt: new Date('2020-11-11'),
          deletedAt: null,
          updatedAt: new Date('2020-11-11'),
          email: 'email',
          id: 'id',
          name: 'name',
          phone: 'phone',
        },
      },
    ],
    user: {
      id: 'userId',
      username: 'username',
      email: 'email',
      password: 'password',
      userRoles: [],
      createdAt: new Date('2020-11-11'),
      updatedAt: new Date('2020-11-11'),
      deletedAt: null,
    },
    createdAt: new Date('2020-11-11'),
    updatedAt: new Date('2020-11-11'),
    deletedAt: null,
  },
};

const mockOrderProductsRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

describe('OrderProductsService', () => {
  let orderProductsService: OrderProductsService;
  let orderProductsRepository: jest.Mocked<Repository<OrderProducts>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductsService,
        {
          provide: getRepositoryToken(OrderProducts),
          useValue: mockOrderProductsRepository,
        },
      ],
    }).compile();

    orderProductsService =
      module.get<OrderProductsService>(OrderProductsService);
    orderProductsRepository = module.get(getRepositoryToken(OrderProducts));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all order products matching the criteria', async () => {
      orderProductsRepository.find.mockResolvedValue([mockOrderProduct]);

      const result = await orderProductsService.findAll({ id: '1' });

      expect(result).toEqual([mockOrderProduct]);
      expect(orderProductsRepository.find).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return an empty array if no order products match the criteria', async () => {
      orderProductsRepository.find.mockResolvedValue([]);

      const result = await orderProductsService.findAll({
        id: 'nonexistent-id',
      });

      expect(result).toEqual([]);
      expect(orderProductsRepository.find).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an order product by criteria', async () => {
      orderProductsRepository.findOne.mockResolvedValue(mockOrderProduct);

      const result = await orderProductsService.findOne({ id: '1' });

      expect(result).toEqual(mockOrderProduct);
      expect(orderProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('should create a new order product', async () => {
      orderProductsRepository.save.mockResolvedValue(mockOrderProduct);

      const result = await orderProductsService.create(mockOrderProduct);

      expect(result).toEqual(mockOrderProduct);
      expect(orderProductsRepository.save).toHaveBeenCalledWith(
        mockOrderProduct,
      );
    });
  });

  describe('delete', () => {
    it('should delete an order product by id', async () => {
      orderProductsRepository.delete.mockResolvedValue(undefined);

      await orderProductsService.delete('1');

      expect(orderProductsRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an order product with the provided data', async () => {
      orderProductsRepository.update.mockResolvedValue(undefined);

      const updateData = { quantity: 5 };
      const orderProductId = '1';

      await orderProductsService.update(updateData, orderProductId);

      expect(orderProductsRepository.update).toHaveBeenCalledWith(
        orderProductId,
        updateData,
      );
    });

    it('should throw an error if update fails', async () => {
      orderProductsRepository.update.mockRejectedValue(
        new Error('Update failed'),
      );

      const updateData = { quantity: 5 };
      const orderProductId = '1';

      await expect(
        orderProductsService.update(updateData, orderProductId),
      ).rejects.toThrow('Update failed');

      expect(orderProductsRepository.update).toHaveBeenCalledWith(
        orderProductId,
        updateData,
      );
    });
  });
});
