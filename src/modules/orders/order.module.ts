import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '../../entities/orders/order.entity';
import { ClientsModule } from '../clients/clients.module';
import { EmailModule } from '../email/email.module';
import { OrderProductsModule } from '../order-products/order-products.module';
import { ProductModule } from '../products/product.module';
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module';

import { OrderStatusChangedListener } from './events/order-status-changed.listener';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductModule,
    OrderProductsModule,
    ClientsModule,
    EmailModule,
    ShoppingCartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderStatusChangedListener],
  exports: [OrdersService],
})
export class OrderModule {}
