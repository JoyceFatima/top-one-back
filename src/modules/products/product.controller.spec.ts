import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { getToken } from '@/utils/funcs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

jest.mock('@/utils/funcs');
const mockGetToken = getToken as jest.Mock;

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 100,
  stock: 10,
  discount: 10,
};
const mockProductService = {
  findAll: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  applyDiscount: jest.fn(),
  deleteProduct: jest.fn(),
};

describe('ProductController', () => {
  let productController: ProductController;
  let productService: typeof mockProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      productService.findAll.mockResolvedValue([mockProduct]);

      const result = await productController.findAll();

      expect(result).toEqual({ message: 'Success', data: [mockProduct] });
      expect(productService.findAll).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      productService.findAll.mockRejectedValue(new Error('Error retrieving products'));

      await expect(productController.findAll()).rejects.toEqual({
        message: 'Error retrieving products',
        statusCode: 400,
      });
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      mockGetToken.mockReturnValue('decodedToken');
      productService.createProduct.mockResolvedValue(mockProduct);

      const result = await productController.createProduct('Bearer token', mockProduct);

      expect(result).toEqual({ message: 'Product created', data: mockProduct });
      expect(mockGetToken).toHaveBeenCalledWith('Bearer token');
      expect(productService.createProduct).toHaveBeenCalledWith('decodedToken', mockProduct);
    });

    it('should handle errors gracefully', async () => {
      mockGetToken.mockReturnValue('decodedToken');
      productService.createProduct.mockRejectedValue(new Error('Error creating product'));

      await expect(productController.createProduct('Bearer token', mockProduct)).rejects.toEqual({
        message: 'Error creating product',
        statusCode: 400,
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      productService.updateProduct.mockResolvedValue(mockProduct);

      const result = await productController.updateProduct('1', { name: 'Updated Product' });

      expect(result).toEqual({ message: 'Product updated', data: mockProduct });
      expect(productService.updateProduct).toHaveBeenCalledWith({ name: 'Updated Product' }, '1');
    });

    it('should handle errors gracefully', async () => {
      productService.updateProduct.mockRejectedValue(new Error('Error updating product'));

      await expect(productController.updateProduct('1', { name: 'Updated Product' })).rejects.toEqual({
        message: 'Error updating product',
        statusCode: 400,
      });
    });
  });

  describe('applyDiscount', () => {
    it('should apply a discount to a product', async () => {
      productService.applyDiscount.mockResolvedValue({ ...mockProduct, discount: 20 });

      const result = await productController.applyDiscount('1', 20);

      expect(result).toEqual({ message: 'Discount applied', data: { ...mockProduct, discount: 20 } });
      expect(productService.applyDiscount).toHaveBeenCalledWith('1', 20);
    });

    it('should handle errors gracefully', async () => {
      productService.applyDiscount.mockRejectedValue(new Error('Error applying discount'));

      await expect(productController.applyDiscount('1', 20)).rejects.toEqual({
        message: 'Error applying discount',
        statusCode: 400,
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by id', async () => {
      productService.deleteProduct.mockResolvedValue(undefined);

      const result = await productController.deleteProduct('1');

      expect(result).toEqual({ message: 'Product deleted', statusCode: 200 });
      expect(productService.deleteProduct).toHaveBeenCalledWith('1');
    });

    it('should handle errors gracefully', async () => {
      productService.deleteProduct.mockRejectedValue(new Error('Error deleting product'));

      await expect(productController.deleteProduct('1')).rejects.toEqual({
        message: 'Error deleting product',
        statusCode: 400,
      });
    });
  });
});