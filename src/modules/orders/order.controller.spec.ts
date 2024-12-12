import { Status } from '@/common/enums';
import { Order } from '@/entities/orders/order.entity';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { getToken } from '@/utils/funcs';
import { Test, TestingModule } from '@nestjs/testing';
import { IOrder } from './interfaces/order.dto';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';

jest.mock('@/utils/funcs');
const mockGetToken = getToken as jest.Mock;

const mockOrder: Order = {
  client: {
    id: 'client1',
    name: 'clientName',
    email: 'clientEmail',
    phone: 'clientPhone',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockAddOrder: IOrder = {
  clientId: 'clientId',
  shoppingCarts: ['shoppingCarts'],
  products: [{
    id: 'id',
    quantity: 2
  }]
}

const mockOrdersService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
};

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: typeof mockOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return orders filtered by clientId and userId', async () => {
      const clientIdFilter = '1';
      const userIdFilter = '1';
      const statusFilter = Status.PROCESSING;
      ordersService.findAll.mockResolvedValue([mockOrder]);

      const result = await ordersController.findAll(statusFilter, clientIdFilter, userIdFilter);

      expect(result).toEqual({ message: 'Success', data: [mockOrder], statusCode: 200 });
      expect(ordersService.findAll).toHaveBeenCalledWith({
        status: statusFilter,
        client: { id: clientIdFilter },
        user: { id: userIdFilter },
      });
    });

    it('should return a success response when orders are fetched', async () => {
      ordersService.findAll.mockResolvedValue([mockOrder]);

      const result = await ordersController.findAll();

      expect(result).toEqual({ message: 'Success', data: [mockOrder], statusCode: 200 });
    });

    it('should throw an error with custom message when fetching fails', async () => {
      ordersService.findAll.mockRejectedValue(new Error('Custom error message'));

      await expect(ordersController.findAll()).rejects.toEqual({
        message: 'Custom error message',
        statusCode: 400,
      });
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      ordersService.findOne.mockResolvedValue(mockOrder);

      const result = await ordersController.findOne('1');

      expect(result).toEqual({ message: 'Success', data: mockOrder, statusCode: 200 });
      expect(ordersService.findOne).toHaveBeenCalledWith('1');
    });

    it('should handle errors gracefully', async () => {
      ordersService.findOne.mockRejectedValue(new Error('Order not found'));

      await expect(ordersController.findOne('1')).rejects.toEqual({
        message: 'Order not found',
        statusCode: 400,
      });
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      mockGetToken.mockReturnValue('mockToken');
      ordersService.create.mockResolvedValue(mockOrder);

      const result = await ordersController.create('Bearer mockToken', mockAddOrder);

      expect(result).toEqual({ message: 'Order created', data: mockOrder, statusCode: 201 });
      expect(mockGetToken).toHaveBeenCalledWith('Bearer mockToken');
      expect(ordersService.create).toHaveBeenCalledWith('mockToken', mockAddOrder);
    });

    it('should handle errors gracefully', async () => {
      mockGetToken.mockReturnValue('mockToken');
      ordersService.create.mockRejectedValue(new Error('Error creating order'));

      await expect(ordersController.create('Bearer mockToken', mockAddOrder)).rejects.toEqual({
        message: 'Error creating order',
        statusCode: 400,
      });
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an order', async () => {
      ordersService.updateStatus.mockResolvedValue(mockOrder);

      const result = await ordersController.updateStatus('1', { status: Status.SENT });

      expect(result).toEqual({ message: 'Order updated', data: mockOrder, statusCode: 200 });
      expect(ordersService.updateStatus).toHaveBeenCalledWith('1', { status: Status.SENT });
    });

    it('should handle errors gracefully', async () => {
      ordersService.updateStatus.mockRejectedValue(new Error('Error updating status'));

      await expect(
        ordersController.updateStatus('1', { status: Status.DELIVERED }),
      ).rejects.toEqual({
        message: 'Error updating status',
        statusCode: 400,
      });
    });
  });

  describe('delete', () => {
    it('should delete an order by id', async () => {
      ordersService.delete.mockResolvedValue(undefined);

      const result = await ordersController.delete('1');

      expect(result).toEqual({ message: 'Order deleted', statusCode: 200 });
      expect(ordersService.delete).toHaveBeenCalledWith('1');
    });

    it('should handle errors gracefully', async () => {
      ordersService.delete.mockRejectedValue(new Error('Error deleting order'));

      await expect(ordersController.delete('1')).rejects.toEqual({
        message: 'Error deleting order',
        statusCode: 400,
      });
    });
  });
});
