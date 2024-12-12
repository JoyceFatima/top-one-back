import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProducts } from 'src/entities/order-products/order-products.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

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
