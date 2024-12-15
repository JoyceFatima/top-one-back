import { ShoppingCart } from '@/entities/shopping-cart/shopping-cart.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { IShoppingCart } from './interfaces/shopping-cart.dto';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';

const mockAddCartData: IShoppingCart = {
  clientId: 'id',
  productId: 'id',
  quantity: 2,
};

const mockCartData: ShoppingCart = {
  id: '1',
  quantity: 2,
  createdAt: new Date('2020-11-11'),
  updatedAt: new Date('2020-11-11'),
  deletedAt: null,
  client: {
    id: 'client1',
    name: 'clientName',
    email: 'clientEmail',
    phone: 'clientPhone',
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

describe('ShoppingCartController', () => {
  let shoppingCartController: ShoppingCartController;
  let shoppingCartService: ShoppingCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingCartController],
      providers: [
        {
          provide: ShoppingCartService,
          useValue: {
            findAll: jest.fn(),
            addToCart: jest.fn(),
            updateCartItem: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    shoppingCartController = module.get<ShoppingCartController>(
      ShoppingCartController,
    );
    shoppingCartService = module.get<ShoppingCartService>(ShoppingCartService);
  });

  describe('findAll', () => {
    it('should return all items in the cart', async () => {
      jest
        .spyOn(shoppingCartService, 'findAll')
        .mockResolvedValue([mockCartData]);

      const result = await shoppingCartController.findAll();

      expect(shoppingCartService.findAll).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Success', data: [mockCartData] });
    });

    it('should handle errors', async () => {
      jest
        .spyOn(shoppingCartService, 'findAll')
        .mockRejectedValue(new Error('Database error'));

      await expect(shoppingCartController.findAll()).rejects.toThrow(
        'Database error',
      );

      expect(shoppingCartService.findAll).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    it('should add an item to the cart and return updated cart', async () => {
      jest
        .spyOn(shoppingCartService, 'addToCart')
        .mockResolvedValue(mockCartData);
      jest
        .spyOn(shoppingCartService, 'findAll')
        .mockResolvedValue([mockCartData]);

      const result = await shoppingCartController.addToCart(mockAddCartData);

      expect(shoppingCartService.addToCart).toHaveBeenCalledWith(
        mockAddCartData,
      );
      expect(shoppingCartService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Added to cart',
        data: [mockCartData],
      });
    });

    it('should handle errors', async () => {
      jest
        .spyOn(shoppingCartService, 'addToCart')
        .mockRejectedValue(new Error('Add error'));

      await expect(
        shoppingCartController.addToCart(mockAddCartData),
      ).rejects.toThrow('Add error');

      expect(shoppingCartService.addToCart).toHaveBeenCalledWith(
        mockAddCartData,
      );
    });
  });

  describe('updateCartItem', () => {
    it('should update an item in the cart', async () => {
      const updatedCartData = { quantity: 5 };
      jest.spyOn(shoppingCartService, 'updateCartItem').mockResolvedValue({
        ...mockCartData,
        ...updatedCartData,
      });

      const result = await shoppingCartController.updateCartItem(
        mockCartData.id,
        updatedCartData,
      );

      expect(shoppingCartService.updateCartItem).toHaveBeenCalledWith(
        mockCartData.id,
        updatedCartData,
      );
      expect(result).toEqual({
        message: 'Updated cart item',
        data: { ...mockCartData, ...updatedCartData },
      });
    });

    it('should handle errors', async () => {
      jest
        .spyOn(shoppingCartService, 'updateCartItem')
        .mockRejectedValue(new Error('Update error'));

      await expect(
        shoppingCartController.updateCartItem(mockCartData.id, { quantity: 5 }),
      ).rejects.toThrow('Update error');

      expect(shoppingCartService.updateCartItem).toHaveBeenCalledWith(
        mockCartData.id,
        {
          quantity: 5,
        },
      );
    });
  });

  describe('delete', () => {
    it('should delete an item from the cart', async () => {
      jest.spyOn(shoppingCartService, 'delete').mockResolvedValue();

      const result = await shoppingCartController.delete(mockCartData.id);

      expect(shoppingCartService.delete).toHaveBeenCalledWith(mockCartData.id);
      expect(result).toEqual({ message: 'Removed from cart' });
    });

    it('should handle errors', async () => {
      jest
        .spyOn(shoppingCartService, 'delete')
        .mockRejectedValue(new Error('Delete error'));

      await expect(
        shoppingCartController.delete(mockCartData.id),
      ).rejects.toThrow('Delete error');

      expect(shoppingCartService.delete).toHaveBeenCalledWith(mockCartData.id);
    });
  });
});
