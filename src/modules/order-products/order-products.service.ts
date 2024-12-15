import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { OrderProducts } from '@/entities/order-products/order-products.entity';

@Injectable()
export class OrderProductsService {
  constructor(
    @InjectRepository(OrderProducts)
    private productRepository: Repository<OrderProducts>,
  ) {}

  async findAll(): Promise<OrderProducts[]> {
    return this.productRepository.find();
  }

  async findOne(
    where: FindOptionsWhere<OrderProducts>,
  ): Promise<OrderProducts> {
    return this.productRepository.findOne({ where });
  }

  async create(data: Partial<OrderProducts>): Promise<OrderProducts> {
    return this.productRepository.save(data);
  }

  async delete(id: string): Promise<void> {
    this.productRepository.delete(id);
  }
}
