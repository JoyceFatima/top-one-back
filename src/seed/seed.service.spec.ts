import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '@/common/enums';
import { ClientsService } from '@/modules/clients/clients.service';
import { OrdersService } from '@/modules/orders/order.service';
import { ProductService } from '@/modules/products/product.service';
import { RolesService } from '@/modules/roles/roles.service';
import { UsersService } from '@/modules/users/users.service';

import { SeedService } from './seed.service';

describe('SeedService', () => {
  let seedService: SeedService;

  let mockUsersService: Partial<jest.Mocked<UsersService>>;
  let mockRolesService: Partial<jest.Mocked<RolesService>>;
  let mockClientsService: Partial<jest.Mocked<ClientsService>>;
  let mockProductsService: Partial<jest.Mocked<ProductService>>;
  let mockOrdersService: Partial<jest.Mocked<OrdersService>>;

  beforeEach(async () => {
    mockUsersService = {
      findOne: jest.fn(),
      insert: jest.fn(),
    };

    mockRolesService = {
      find: jest.fn(),
      insert: jest.fn(),
    };

    mockClientsService = {
      findOne: jest.fn(),
      insert: jest.fn(),
    };

    mockProductsService = {
      findAll: jest.fn(),
      createProduct: jest.fn(),
    };

    mockOrdersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: RolesService, useValue: mockRolesService },
        { provide: ClientsService, useValue: mockClientsService },
        { provide: ProductService, useValue: mockProductsService },
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('roles', () => {
    it('should insert roles if they do not exist', async () => {
      mockRolesService.find.mockResolvedValue([]);
      await seedService.roles();
      expect(mockRolesService.insert).toHaveBeenCalledTimes(2);
      expect(mockRolesService.insert).toHaveBeenCalledWith({
        role: Role.ADMIN,
      });
      expect(mockRolesService.insert).toHaveBeenCalledWith({
        role: Role.SELLER,
      });
    });

    it('should not insert roles if they already exist', async () => {
      mockRolesService.find.mockResolvedValue([
        {
          name: Role.ADMIN,
          description: 'Admin role',
          id: '1',
          createdAt: new Date('2020-11-11'),
          updatedAt: new Date('2020-11-11'),
          deletedAt: null,
          isActive: true,
        },
        {
          name: Role.SELLER,
          description: 'Seller role',
          id: '2',
          createdAt: new Date('2020-11-11'),
          updatedAt: new Date('2020-11-11'),
          deletedAt: null,
          isActive: true,
        },
      ]);
      await seedService.roles();
      expect(mockRolesService.insert).not.toHaveBeenCalled();
    });
  });

  describe('users', () => {
    it('should insert users if they do not exist', async () => {
      mockUsersService.findOne.mockResolvedValue(null);
      await seedService.users();
      expect(mockUsersService.insert).toHaveBeenCalledTimes(4); // 2 admins + 2 sellers
    });

    it('should not insert users if they already exist', async () => {
      mockUsersService.findOne.mockResolvedValue({ id: 1 } as any);
      await seedService.users();
      expect(mockUsersService.insert).not.toHaveBeenCalled();
    });
  });

  describe('clients', () => {
    it('should insert clients if they do not exist', async () => {
      mockClientsService.findOne.mockResolvedValue(null);
      await seedService.clients();
      expect(mockClientsService.insert).toHaveBeenCalledTimes(2);
    });

    it('should not insert clients if they already exist', async () => {
      mockClientsService.findOne.mockResolvedValue({ id: 1 } as any);
      await seedService.clients();
      expect(mockClientsService.insert).not.toHaveBeenCalled();
    });
  });

  describe('products', () => {
    it('should insert products if they do not exist', async () => {
      mockUsersService.findOne.mockResolvedValue({ id: 1 } as any);
      mockProductsService.findAll.mockResolvedValue([]);
      await seedService.products();
      expect(mockProductsService.createProduct).toHaveBeenCalledTimes(2);
    });

    it('should not insert products if they already exist', async () => {
      mockUsersService.findOne.mockResolvedValue({ id: 1 } as any);
      mockProductsService.findAll.mockResolvedValue([
        { name: 'Product 1' },
      ] as any);
      await seedService.products();
      expect(mockProductsService.createProduct).toHaveBeenCalledTimes(1);
    });
  });

  describe('orders', () => {
    it('should create an order with the correct products and client', async () => {
      mockUsersService.findOne.mockResolvedValue({ id: 1 } as any);
      mockClientsService.findOne.mockResolvedValue({ id: 1 } as any);
      mockProductsService.findAll.mockResolvedValue([
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ] as any);

      await seedService.orders();
      expect(mockOrdersService.create).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          clientId: 1,
          products: [
            { id: 1, quantity: 10 },
            { id: 2, quantity: 20 },
          ],
        }),
      );
    });
  });

  describe('run', () => {
    it('should run all seed methods in sequence', async () => {
      jest.spyOn(seedService, 'roles').mockResolvedValue();
      jest.spyOn(seedService, 'users').mockResolvedValue();
      jest.spyOn(seedService, 'clients').mockResolvedValue();
      jest.spyOn(seedService, 'products').mockResolvedValue();
      jest.spyOn(seedService, 'orders').mockResolvedValue();

      await seedService.run();

      expect(seedService.roles).toHaveBeenCalled();
      expect(seedService.users).toHaveBeenCalled();
      expect(seedService.clients).toHaveBeenCalled();
      expect(seedService.products).toHaveBeenCalled();
      expect(seedService.orders).toHaveBeenCalled();
    });
  });
});
