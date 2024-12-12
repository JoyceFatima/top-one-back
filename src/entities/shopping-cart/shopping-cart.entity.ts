import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Product } from '../products/product.entity';

@Entity('shopping_cart')
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    name: 'quantity',
    default: 1,
  })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Client, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
