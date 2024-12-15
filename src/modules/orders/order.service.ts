import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Status } from '@/common/enums';
import { User } from '@/entities/users/user.entity';

import { Order } from '../../entities/orders/order.entity';
import { ClientsService } from '../clients/clients.service';
import { OrderProductsService } from '../order-products/order-products.service';
import { ProductService } from '../products/product.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

import { OrderStatusChangedEvent } from './events/order-status-changed.event';
import { IOrder } from './interfaces/order.dto';
import { IStatus } from './interfaces/status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly clientService: ClientsService,
    private readonly productService: ProductService,
    private readonly orderProductsService: OrderProductsService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(where?: FindOptionsWhere<Order>): Promise<Order[]> {
    return await this.ordersRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['client', 'orderProducts', 'orderProducts.product'],
    });
  }

  async findOne(id: string): Promise<Order> {
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

  async create(user: User, data: IOrder): Promise<Order> {
    const client = await this.clientService.findOne({ id: data.clientId });

    const productsWithDetails = await Promise.all(
      data.products.map(async ({ id, quantity }) => {
        const product = await this.productService.findOne(id);
        const stock = product.stock - quantity;

        await this.productService.update({ ...product, stock }, id);

        return { product, quantity };
      }),
    );

    const orderProducts = await Promise.all(
      productsWithDetails.map(({ product, quantity }) =>
        this.orderProductsService.create({ product, quantity }),
      ),
    );

    const totalPrice = productsWithDetails.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0,
    );

    const order = {
      client,
      user,
      orderProducts,
      status: Status.PROCESSING,
      totalPrice,
    };
    return this.ordersRepository.save(order).then((res) => {
      for (const shoppingCartId of data.shoppingCarts) {
        this.shoppingCartService.delete(shoppingCartId);
      }
      return res;
    });
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

  async delete(id: string): Promise<void> {
    const order = await this.findOne(id);
    const orderProduct = await this.orderProductsService.findOne({
      order: {
        id,
      },
    });

    await this.orderProductsService.delete(orderProduct.id);
    await this.ordersRepository.remove(order);
  }
}
