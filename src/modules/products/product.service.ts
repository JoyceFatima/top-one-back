import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { decodeToken } from 'src/utils/funcs';
import { Repository } from 'typeorm';
import { Order } from '../../entities/orders/order.entity';
import { Product } from '../../entities/products/product.entity';
import { IProduct } from './interfaces/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async createProduct(token: string, data: IProduct): Promise<Product> {
    const user = decodeToken(token);

    this.validateDiscount(data.discount);

    return this.productRepository.save({
      ...data,
      userId: user.id,
    });
  }

  async updateProduct(data: Partial<IProduct>, id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    if (data.discount !== undefined) {
      this.validateDiscount(data.discount);
    }

    await this.productRepository.update(id, data);

    if (data.price) {
      await this.updateRelatedOrders(id, data.price);
    }

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

  private async updateRelatedOrders(
    productId: string,
    newPrice: number,
  ): Promise<void> {
    // const orders = await this.orderRepository.find({
    //   where: {
    //     orderProducts: {
    //       productId,
    //     },
    //   },
    // });
    // for (const order of orders) {
    //   const findOrderProduct = (order.totalPrice =
    //     newPrice * order.orderProducts.fin);
    //   await this.orderRepository.save(order);
    // }
  }

  private validateDiscount(discount: number): void {
    if (discount < 0 || discount > 100) {
      throw new BadRequestException(
        'Invalid discount percentage. Must be between 0 and 100.',
      );
    }
  }
}
