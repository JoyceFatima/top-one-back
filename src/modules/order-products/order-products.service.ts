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

  async findAll(
    where: FindOptionsWhere<OrderProducts>,
  ): Promise<OrderProducts[]> {
    return this.productRepository.find({ where });
  }

  async findOne(
    where: FindOptionsWhere<OrderProducts>,
  ): Promise<OrderProducts> {
    return this.productRepository.findOne({ where });
  }

  async create(data: Partial<OrderProducts>): Promise<OrderProducts> {
    return this.productRepository.save(data);
  }

  async update(data: Partial<OrderProducts>, id: string): Promise<void> {
    await this.productRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    this.productRepository.delete(id);
  }
}
