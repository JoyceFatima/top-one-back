import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShoppingCart } from '../../entities/shopping-cart/shopping-cart.entity';
import { ClientsService } from '../clients/clients.service';
import { ProductService } from '../products/product.service';
import { ShoppingCartService } from './shopping-cart.service';

const mockCartItem = {
  id: '1',
  quantity: 2,
  client: { id: '1', name: 'Test Client' },
  product: { id: '1', name: 'Test Product', price: 100 },
};
const mockShoppingCartRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};
const mockClientService = {
  findOne: jest.fn(),
};
const mockProductService = {
  findOne: jest.fn(),
};

describe('ShoppingCartService', () => {
  let shoppingCartService: ShoppingCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        {
          provide: getRepositoryToken(ShoppingCart),
          useValue: mockShoppingCartRepository,
        },
        { provide: ClientsService, useValue: mockClientService },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    shoppingCartService = module.get<ShoppingCartService>(ShoppingCartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all items in the shopping cart', async () => {
      mockShoppingCartRepository.find.mockResolvedValue([mockCartItem]);

      const result = await shoppingCartService.findAll();

      expect(result).toEqual([mockCartItem]);
      expect(mockShoppingCartRepository.find).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    it('should add a new item to the cart', async () => {
      mockClientService.findOne.mockResolvedValue(mockCartItem.client);
      mockProductService.findOne.mockResolvedValue(mockCartItem.product);
      mockShoppingCartRepository.findOne.mockResolvedValue(null);
      mockShoppingCartRepository.save.mockResolvedValue(mockCartItem);

      const result = await shoppingCartService.addToCart({
        clientId: '1',
        productId: '1',
        quantity: 2,
      });

      expect(result).toEqual(mockCartItem);
      expect(mockClientService.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(mockProductService.findOne).toHaveBeenCalledWith('1');
      expect(mockShoppingCartRepository.save).toHaveBeenCalledWith({
        quantity: 2,
        client: mockCartItem.client,
        product: mockCartItem.product,
      });
    });

    it('should update quantity if item already exists in the cart', async () => {
      const existingCartItem = { ...mockCartItem };
      mockClientService.findOne.mockResolvedValue(mockCartItem.client);
      mockProductService.findOne.mockResolvedValue(mockCartItem.product);
      mockShoppingCartRepository.findOne.mockResolvedValue(existingCartItem);
      mockShoppingCartRepository.save.mockResolvedValue({
        ...existingCartItem,
        quantity: 4,
      });

      const result = await shoppingCartService.addToCart({
        clientId: '1',
        productId: '1',
        quantity: 2,
      });

      expect(result.quantity).toEqual(4);
      expect(mockShoppingCartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 4 }),
      );
    });

    it('should throw NotFoundException if client not found', async () => {
      mockClientService.findOne.mockResolvedValue(null);

      await expect(
        shoppingCartService.addToCart({
          clientId: '1',
          productId: '1',
          quantity: 2,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockClientService.findOne.mockResolvedValue(mockCartItem.client);
      mockProductService.findOne.mockResolvedValue(null);

      await expect(
        shoppingCartService.addToCart({
          clientId: '1',
          productId: '1',
          quantity: 2,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCartItem', () => {
    it('should update an item in the cart', async () => {
      mockShoppingCartRepository.findOne.mockResolvedValue(mockCartItem);
      mockShoppingCartRepository.save.mockResolvedValue({
        ...mockCartItem,
        quantity: 5,
      });

      const result = await shoppingCartService.updateCartItem('1', {
        quantity: 5,
      });

      expect(result.quantity).toEqual(5);
      expect(mockShoppingCartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 5 }),
      );
    });

    it('should throw NotFoundException if item not found', async () => {
      mockShoppingCartRepository.findOne.mockResolvedValue(null);

      await expect(
        shoppingCartService.updateCartItem('1', { quantity: 5 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an item from the cart', async () => {
      mockShoppingCartRepository.findOne.mockResolvedValue(mockCartItem);
      mockShoppingCartRepository.delete.mockResolvedValue(undefined);

      await shoppingCartService.delete('1');

      expect(mockShoppingCartRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockShoppingCartRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if item not found', async () => {
      mockShoppingCartRepository.findOne.mockResolvedValue(null);

      await expect(shoppingCartService.delete('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
