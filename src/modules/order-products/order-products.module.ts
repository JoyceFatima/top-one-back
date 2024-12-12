import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProducts } from 'src/entities/order-products/order-products.entity';
import { OrderProductsController } from './order-products.controller';
import { OrderProductsService } from './order-products.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProducts])],
  controllers: [OrderProductsController],
  providers: [OrderProductsService],
  exports: [OrderProductsService],
})
export class OrderProductsModule {}
