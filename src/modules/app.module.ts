import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../common/database/database-config';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { OrderModule } from './orders/order.module';
import { ProductModule } from './products/product.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    OrderModule,
    ShoppingCartModule,
    ProductModule,
    ClientsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {}
}
