import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShoppingCart } from '../../entities/shopping-cart/shopping-cart.entity';
import { ClientsModule } from '../clients/clients.module';
import { ProductModule } from '../products/product.module';

import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingCart]),
    ProductModule,
    ClientsModule,
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}
