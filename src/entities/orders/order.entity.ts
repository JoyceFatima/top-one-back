import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Status } from '@/common/enums';

import { Client } from '../clients/clients.entity';
import { OrderProducts } from '../order-products/order-products.entity';
import { User } from '../users/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    name: 'total_price',
    precision: 10,
    scale: 2,
  })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PROCESSING,
  })
  @Index()
  status: Status;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  @Index()
  deletedAt: Date;

  @ManyToOne(() => Client, (client) => client.id, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.order, {
    eager: true,
  })
  orderProducts: OrderProducts[];
}
