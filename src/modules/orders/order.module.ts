import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/orders/order.entity';
import { Product } from '../../entities/products/product.entity';
import { EmailModule } from '../email/email.module';
import { OrderStatusChangedListener } from './events/order-status-changed.listener';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product]), EmailModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderStatusChangedListener],
  exports: [OrdersService],
})
export class OrderModule {}
