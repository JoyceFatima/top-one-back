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
import { OrderProducts } from '../order-products/order-products.entity';
import { ShoppingCart } from '../shopping-cart/shopping-cart.entity';
import { User } from '../users/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'name', unique: true })
  @Index()
  name: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description: string;

  @Column({ type: 'decimal', name: 'price', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', name: 'stock', default: 0 })
  stock: number;

  @Column({
    type: 'decimal',
    name: 'discount',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discount: number;

  @Column({ type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  @Index()
  deletedAt: Date;

  @OneToMany(() => ShoppingCart, (shoppingCart) => shoppingCart.product)
  shoppingCart: ShoppingCart[];

  @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.product)
  orderProducts: OrderProducts[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
