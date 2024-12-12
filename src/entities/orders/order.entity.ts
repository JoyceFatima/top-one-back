import { Status } from 'src/common/enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../clients/clients.entity';
import { OrderProducts } from '../order-products/order-products.entity';
import { User } from '../users/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'client_id',
  })
  clientId: string;

  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: true,
  })
  userId?: string;

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
  status: Status;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Client, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  orderProducts: OrderProducts[];
}
