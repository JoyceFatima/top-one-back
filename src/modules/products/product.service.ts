import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/entities/users/user.entity';

import { Product } from '../../entities/products/product.entity';

import { IProduct } from './interfaces/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(user: User, data: IProduct): Promise<Product> {
    this.validateDiscount(data.discount);

    return this.productRepository.save({
      ...data,
      user,
    });
  }

  async update(data: Partial<IProduct>, id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    await this.productRepository.update(id, data);

    return this.productRepository.findOne({ where: { id } });
  }

  async updateProduct(data: Partial<IProduct>, id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    if (data.discount) {
      throw new BadRequestException(
        'Discount cannot be updated using this endpoint',
      );
    }

    await this.productRepository.update(id, data);

    return this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepository.delete(id);
  }

  async applyDiscount(id: string, discount: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    this.validateDiscount(discount);

    product.discount = discount;

    await this.productRepository.save(product);

    return product;
  }

  private validateDiscount(discount: number): void {
    if (discount < 0 || discount > 100) {
      throw new BadRequestException(
        'Invalid discount percentage. Must be between 0 and 100.',
      );
    }
  }
}
