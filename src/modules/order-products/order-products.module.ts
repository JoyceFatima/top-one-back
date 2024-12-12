import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProducts } from 'src/entities/order-products/order-products.entity';
import { OrderProductsService } from './order-products.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProducts])],
  providers: [OrderProductsService],
  exports: [OrderProductsService],
})
export class OrderProductsModule {}
