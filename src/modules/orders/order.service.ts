import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/common/enums';
import { decodeToken } from 'src/utils/funcs';
import { Repository } from 'typeorm';
import { Order } from '../../entities/orders/order.entity';
import { Product } from '../../entities/products/product.entity';
import { OrderStatusChangedEvent } from './events/order-status-changed.event';
import { IOrder } from './interfaces/order.dto';
import { IStatus } from './interfaces/status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(status?: Status): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
      relations: ['client', 'orderProducts', 'orderProducts.product'],
    });
  }

  async findOne(id: string): Promise<Order> {
    if (!id) {
      throw new NotFoundException('Order ID is required');
    }

    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['client', 'orderProducts', 'orderProducts.product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByClient(clientId: string): Promise<Order[]> {
    if (!clientId) {
      throw new BadRequestException('Client ID is required');
    }

    return await this.ordersRepository.find({
      where: {
        client: {
          id: clientId,
        },
      },
      relations: ['orderProducts', 'orderProducts.product'],
    });
  }

  async create(token: string, data: IOrder): Promise<Order> {
    const user = decodeToken(token);
    const product = await this.getProductById(data.productId);

    this.validateQuantity(data.quantity);
    this.validateStock(product.stock, data.quantity);

    const totalPrice = this.calculateTotalPrice(product.price, data.quantity);

    product.stock -= data.quantity;
    await this.productsRepository.save(product);
    const order = this.ordersRepository.create({
      ...data,
      user,
      totalPrice,
    });

    return await this.ordersRepository.save(order);
  }

  async update(id: string, data: Partial<IOrder>): Promise<Order> {
    const order = await this.findOne(id);

    if (data.productId) {
      const product = await this.getProductById(data.productId);
      this.validateStock(product.stock, data.quantity);
      order.totalPrice = this.calculateTotalPrice(product.price, data.quantity);
      product.stock -= data.quantity;
      await this.productsRepository.save(product);
    }

    return await this.ordersRepository.save({ ...order, ...data });
  }

  private async getProductById(productId: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private validateQuantity(quantity: number): void {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }
  }

  private validateStock(stock: number, quantity: number): void {
    if (quantity > stock) {
      throw new BadRequestException('Insufficient stock for this product');
    }
  }

  private calculateTotalPrice(price: number, quantity: number): number {
    return price * quantity;
  }

  async delete(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async updateStatus(orderId: string, newStatus: IStatus): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['client'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const oldStatus = order.status;
    order.status = newStatus.status;

    await this.ordersRepository.save(order);

    this.eventEmitter.emit(
      'order.status.changed',
      new OrderStatusChangedEvent(
        order.id,
        oldStatus,
        newStatus.status,
        order.client.email,
        order.client.name,
      ),
    );

    return order;
  }
}
