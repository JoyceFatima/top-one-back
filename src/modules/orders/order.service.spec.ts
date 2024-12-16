import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Status } from '@/common/enums';
import { decodeToken } from '@/utils/funcs';

import { Order } from '../../entities/orders/order.entity';
import { ClientsService } from '../clients/clients.service';
import { OrderProductsService } from '../order-products/order-products.service';
import { ProductService } from '../products/product.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

import { OrdersService } from './order.service';

jest.mock('@/utils/funcs');
const mockDecodeToken = decodeToken as jest.Mock;

const mockOrder = {
  id: '1',
  client: { id: '1', email: 'test@example.com', name: 'Test Client' },
  orderProducts: [],
  status: Status.PROCESSING,
  totalPrice: 100,
};
const mockOrdersRepository = {
  find: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};
const mockClientService = {
  findOne: jest.fn(),
};
const mockProductService = {
  findOne: jest.fn(),
  update: jest.fn(),
};
const mockOrderProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};
const mockShoppingCartService = {
  delete: jest.fn(),
};
const mockEventEmitter = {
  emit: jest.fn(),
};

describe('OrdersService', () => {
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrdersRepository },
        { provide: ClientsService, useValue: mockClientService },
        { provide: ProductService, useValue: mockProductService },
        { provide: OrderProductsService, useValue: mockOrderProductsService },
        { provide: ShoppingCartService, useValue: mockShoppingCartService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      mockOrdersRepository.find.mockResolvedValue([mockOrder]);

      const result = await ordersService.findAll();

      expect(result).toEqual([mockOrder]);
      expect(mockOrdersRepository.find).toHaveBeenCalledWith({
        where: undefined,
        order: { createdAt: 'DESC' },
        relations: ['client', 'orderProducts', 'orderProducts.product'],
      });
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(mockOrder);

      const result = await ordersService.findOne('1');

      expect(result).toEqual(mockOrder);
      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['client', 'orderProducts', 'orderProducts.product'],
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(null);

      await expect(ordersService.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByClient', () => {
    it('should return orders for a specific client', async () => {
      mockOrdersRepository.find.mockResolvedValue([mockOrder]);

      const result = await ordersService.findByClient('1');

      expect(result).toEqual([mockOrder]);
      expect(mockOrdersRepository.find).toHaveBeenCalledWith({
        where: { client: { id: '1' } },
        relations: ['orderProducts', 'orderProducts.product'],
      });
    });

    it('should throw BadRequestException if clientId is missing', async () => {
      await expect(ordersService.findByClient('')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      mockDecodeToken.mockReturnValue({ id: 'user1' });
      mockClientService.findOne.mockResolvedValue(mockOrder.client);
      mockProductService.findOne.mockResolvedValue({
        id: 'prod1',
        price: 50,
        stock: 10,
      });
      mockOrderProductsService.create.mockResolvedValue({ id: 'op1' });
      mockOrdersRepository.save.mockResolvedValue(mockOrder);

      const result = await ordersService.create({ id: 'user1' } as any, {
        clientId: '1',
        products: [{ id: 'prod1', quantity: 2 }],
        shoppingCarts: ['cart1'],
      });

      expect(result).toEqual(mockOrder);
      expect(mockShoppingCartService.delete).toHaveBeenCalledWith('cart1');
      expect(mockOrdersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          client: mockOrder.client,
          totalPrice: 100,
        }),
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an order', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(mockOrder);

      const result = await ordersService.updateStatus('1', {
        status: Status.SENT,
      });

      expect(result.status).toEqual(Status.SENT);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'order.status.changed',
        expect.any(Object),
      );
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(null);

      await expect(
        ordersService.updateStatus('1', { status: Status.DELIVERED }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an order and its related products', async () => {
      const orderId = 'order-123';
      const mockOrder = { id: orderId };
      const mockOrderProducts = [{ id: 'product-1' }, { id: 'product-2' }];

      mockOrdersRepository.findOne.mockResolvedValue(mockOrder as any);
      mockOrderProductsService.findAll.mockResolvedValue(
        mockOrderProducts as any,
      );
      mockOrderProductsService.delete.mockResolvedValue(undefined);
      mockOrdersRepository.remove.mockResolvedValue(undefined);

      await ordersService.delete(orderId);

      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        relations: ['client', 'orderProducts', 'orderProducts.product'],
        where: { id: 'order-123' },
      });
      expect(mockOrderProductsService.findAll).toHaveBeenCalledWith({
        order: { id: orderId },
      });
      expect(mockOrderProductsService.delete).toHaveBeenCalledTimes(
        mockOrderProducts.length,
      );
      mockOrderProducts.forEach((orderProduct) =>
        expect(mockOrderProductsService.delete).toHaveBeenCalledWith(
          orderProduct.id,
        ),
      );
      expect(mockOrdersRepository.remove).toHaveBeenCalledWith(mockOrder);
    });

    it('should delete an order and its related products', async () => {
      const orderId = 'order-123';
      const mockOrder = { id: orderId };
      const mockOrderProducts = [{ id: 'product-1' }, { id: 'product-2' }];

      mockOrdersRepository.findOne.mockResolvedValue(mockOrder as any);
      mockOrderProductsService.findAll.mockResolvedValue(
        mockOrderProducts as any,
      );
      mockOrderProductsService.delete.mockResolvedValue(undefined);
      mockOrdersRepository.remove.mockResolvedValue(undefined);

      await ordersService.delete(orderId);

      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['client', 'orderProducts', 'orderProducts.product'],
      });
      expect(mockOrderProductsService.findAll).toHaveBeenCalledWith({
        order: { id: orderId },
      });
      expect(mockOrderProductsService.delete).toHaveBeenCalledTimes(
        mockOrderProducts.length,
      );
      mockOrderProducts.forEach((orderProduct) =>
        expect(mockOrderProductsService.delete).toHaveBeenCalledWith(
          orderProduct.id,
        ),
      );
      expect(mockOrdersRepository.remove).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('update', () => {
    it('should update an order and its related products', async () => {
      // Mock data
      const orderId = 'order-123';
      const mockOrder = {
        id: orderId,
        orderProducts: [
          {
            id: 'op1',
            quantity: 2,
            product: { id: 'prod1', stock: 5, price: 10 },
          },
          {
            id: 'op2',
            quantity: 1,
            product: { id: 'prod2', stock: 10, price: 20 },
          },
        ],
        totalPrice: 50,
        updatedAt: new Date(),
      };
      const updatedProducts = [
        { id: 'prod1', stock: 7, price: 10 },
        { id: 'prod2', stock: 11, price: 20 },
      ];
      const newOrderProducts = [
        { id: 'nop1', product: updatedProducts[0], quantity: 3 },
        { id: 'nop2', product: updatedProducts[1], quantity: 1 },
      ];

      // Mock implementations
      mockOrdersRepository.findOne.mockResolvedValue(mockOrder as any);
      mockProductService.findOne
        .mockResolvedValueOnce(mockOrder.orderProducts[0].product) // First product
        .mockResolvedValueOnce(mockOrder.orderProducts[1].product) // Second product
        .mockResolvedValueOnce(updatedProducts[0]) // Updated first product
        .mockResolvedValueOnce(updatedProducts[1]); // Updated second product
      mockProductService.update.mockResolvedValue(undefined);
      mockOrderProductsService.delete.mockResolvedValue(undefined);
      mockOrderProductsService.create
        .mockResolvedValueOnce(newOrderProducts[0])
        .mockResolvedValueOnce(newOrderProducts[1]);
      mockOrdersRepository.save.mockResolvedValue(undefined);

      // Execute the method
      const updatedData = {
        products: [
          { id: 'prod1', quantity: 3 },
          { id: 'prod2', quantity: 1 },
        ],
      };
      await ordersService.update(orderId, updatedData as any);

      // Assertions for reverting stock of old products
      expect(mockProductService.update).toHaveBeenNthCalledWith(
        1,
        { id: 'prod1', stock: 7, price: 10 },
        'prod1',
      );
      expect(mockProductService.update).toHaveBeenNthCalledWith(
        2,
        { id: 'prod2', stock: 11, price: 20 },
        'prod2',
      );

      // Assertions for updating stock of new products
      expect(mockProductService.update).toHaveBeenNthCalledWith(
        3,
        { id: 'prod1', stock: 4, price: 10 },
        'prod1',
      );
      expect(mockProductService.update).toHaveBeenNthCalledWith(
        4,
        { id: 'prod2', stock: 10, price: 20 },
        'prod2',
      );

      // Assertions for other method calls
      expect(mockOrderProductsService.delete).toHaveBeenCalledTimes(2);
      expect(mockOrderProductsService.create).toHaveBeenCalledTimes(2);
      expect(mockOrdersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          totalPrice: 50,
          orderProducts: newOrderProducts,
        }),
      );
    });

    it('should throw an error if the order is not found', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(null);

      await expect(
        ordersService.update('invalid-order-id', { products: [] } as any),
      ).rejects.toThrow('Order with ID invalid-order-id not found.');

      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-order-id' },
        relations: ['orderProducts', 'orderProducts.product'],
      });
      expect(mockProductService.findOne).not.toHaveBeenCalled();
      expect(mockProductService.update).not.toHaveBeenCalled();
      expect(mockOrderProductsService.delete).not.toHaveBeenCalled();
      expect(mockOrdersRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if stock is insufficient for a product', async () => {
      // Mock data
      const orderId = 'order-123';
      const mockOrder = {
        id: orderId,
        orderProducts: [
          { id: 'op1', quantity: 2, product: { id: 'prod1', stock: 5 } },
        ],
      };
      const insufficientProduct = { id: 'prod1', stock: 1, price: 10 };

      // Mock implementations
      mockOrdersRepository.findOne.mockResolvedValue(mockOrder as any);
      mockProductService.findOne.mockResolvedValueOnce(
        mockOrder.orderProducts[0].product,
      ); // For old products
      mockProductService.findOne.mockResolvedValueOnce(insufficientProduct); // For new products

      // Execute and assert
      await expect(
        ordersService.update(orderId, {
          products: [{ id: 'prod1', quantity: 3 }],
        } as any),
      ).rejects.toThrow('Insufficient stock for product ID prod1');

      // Assertions
      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['orderProducts', 'orderProducts.product'],
      });
      expect(mockProductService.findOne).toHaveBeenCalledWith('prod1');
    });
  });
});
