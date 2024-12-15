import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { seedDatabaseConfig } from '@/common/database/database-config';
import { AuthModule } from '@/modules/auth/auth.module';
import { ClientsModule } from '@/modules/clients/clients.module';
import { OrderProductsModule } from '@/modules/order-products/order-products.module';
import { OrderModule } from '@/modules/orders/order.module';
import { ProductModule } from '@/modules/products/product.module';
import { RolesModule } from '@/modules/roles/roles.module';
import { ShoppingCartModule } from '@/modules/shopping-cart/shopping-cart.module';
import { UsersModule } from '@/modules/users/users.module';

import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(seedDatabaseConfig),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    OrderModule,
    ShoppingCartModule,
    ProductModule,
    ClientsModule,
    OrderProductsModule,
    RolesModule,
    SeedModule,
  ],
  providers: [SeedService],
})
export class SeedModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {}
}
