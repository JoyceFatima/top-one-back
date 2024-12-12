import { decodeToken } from '@/utils/funcs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/products/product.entity';
import { ProductService } from './product.service';

jest.mock('@/utils/funcs');
const mockDecodeToken = decodeToken as jest.Mock;

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 100,
  stock: 10,
  discount: 10,
};
const mockProductRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      mockProductRepository.find.mockResolvedValue([mockProduct]);

      const result = await productService.findAll();

      expect(result).toEqual([mockProduct]);
      expect(mockProductRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await productService.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(productService.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      mockDecodeToken.mockReturnValue({ id: 'user1' });
      mockProductRepository.save.mockResolvedValue(mockProduct);

      const result = await productService.createProduct('token', {
        name: 'New Product',
        price: 50,
        stock: 20,
        discount: 10,
      });

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Product',
          userId: 'user1',
        }),
      );
    });

    it('should throw BadRequestException for invalid discount', async () => {
      mockDecodeToken.mockReturnValue({ id: 'user1' });

      await expect(
        productService.createProduct('token', {
          name: 'New Product',
          price: 50,
          stock: 20,
          discount: 110,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue(undefined);
      mockProductRepository.findOne.mockResolvedValue({
        ...mockProduct,
        name: 'Updated Product',
      });

      const result = await productService.update(
        { name: 'Updated Product' },
        '1',
      );

      expect(result.name).toEqual('Updated Product');
      expect(mockProductRepository.update).toHaveBeenCalledWith('1', {
        name: 'Updated Product',
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(
        productService.update({ name: 'Updated Product' }, '1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should throw BadRequestException if trying to update discount', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(
        productService.updateProduct({ discount: 20 }, '1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if trying to update discount', async () => {
      mockProductRepository.findOne.mockResolvedValue(undefined);

      await expect(
        productService.updateProduct({ discount: 20 }, '1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update a product without modifying discount', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue(undefined);
      mockProductRepository.findOne.mockResolvedValue({
        ...mockProduct,
        name: 'Updated Product',
      });

      const result = await productService.updateProduct(
        { name: 'Updated Product' },
        '1',
      );

      expect(result.name).toEqual('Updated Product');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by id', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await productService.deleteProduct('1');

      expect(mockProductRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(productService.deleteProduct('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('applyDiscount', () => {
    it('should apply a discount to a product', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.save.mockResolvedValue({
        ...mockProduct,
        discount: 20,
      });

      const result = await productService.applyDiscount('1', 20);

      expect(result.discount).toEqual(20);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ discount: 20 }),
      );
    });

    it('should throw BadRequestException for invalid discount', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(productService.applyDiscount('1', 200)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(productService.applyDiscount('1', 20)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
