import { Status } from '@/common/enums';
import { decodeToken } from '@/utils/funcs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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

      await expect(ordersService.findOne('1')).rejects.toThrow(NotFoundException);
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
      await expect(ordersService.findByClient('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      mockDecodeToken.mockReturnValue({ id: 'user1' });
      mockClientService.findOne.mockResolvedValue(mockOrder.client);
      mockProductService.findOne.mockResolvedValue({ id: 'prod1', price: 50, stock: 10 });
      mockOrderProductsService.create.mockResolvedValue({ id: 'op1' });
      mockOrdersRepository.save.mockResolvedValue(mockOrder);

      const result = await ordersService.create('token', {
        clientId: '1',
        products: [{ id: 'prod1', quantity: 2 }],
        shoppingCarts: ['cart1'],
      });

      expect(result).toEqual(mockOrder);
      expect(mockShoppingCartService.delete).toHaveBeenCalledWith('cart1');
      expect(mockOrdersRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        client: mockOrder.client,
        totalPrice: 100,
      }));
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an order', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(mockOrder);

      const result = await ordersService.updateStatus('1', { status: Status.SENT });

      expect(result.status).toEqual(Status.SENT);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('order.status.changed', expect.any(Object));
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(null);

      await expect(ordersService.updateStatus('1', { status: Status.DELIVERED })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an order and its associated products', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderProductsService.findOne.mockResolvedValue({ id: 'op1' });

      await ordersService.delete('1');

      expect(mockOrderProductsService.delete).toHaveBeenCalledWith('op1');
      expect(mockOrdersRepository.remove).toHaveBeenCalledWith(mockOrder);
    });
  });
});
