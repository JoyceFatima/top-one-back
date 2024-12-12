import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProducts } from 'src/entities/order-products/order-products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderProductsService {
  constructor(
    @InjectRepository(OrderProducts)
    private productRepository: Repository<OrderProducts>,
  ) {}

  async findAll(): Promise<OrderProducts[]> {
    return this.productRepository.find();
  }
}
