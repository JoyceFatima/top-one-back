import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCart } from '../../entities/shopping-cart/shopping-cart.entity';
import { IShoppingCart } from './interfaces/shopping-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
  ) {}

  async findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartRepository.find({ relations: ['user', 'product'] });
  }

  async addToCart(data: IShoppingCart): Promise<ShoppingCart> {
    const existingCartItem = await this.shoppingCartRepository.findOne({
      where: { clientId: data.clientId, productId: data.productId },
    });

    if (existingCartItem) {
      existingCartItem.quantity += data.quantity;
      return this.shoppingCartRepository.save(existingCartItem);
    }

    const newCartItem = this.shoppingCartRepository.create(data);
    return this.shoppingCartRepository.save(newCartItem);
  }

  async updateCartItem(
    id: string,
    data: Partial<IShoppingCart>,
  ): Promise<ShoppingCart> {
    const cartItem = await this.shoppingCartRepository.findOne({
      where: { id },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in the cart');
    }

    Object.assign(cartItem, data);
    return this.shoppingCartRepository.save(cartItem);
  }

  async removeFromCart(id: string): Promise<void> {
    const cartItem = await this.shoppingCartRepository.findOne({
      where: { id },
    });
    if (!cartItem) throw new NotFoundException('Item not found in the cart');
    await this.shoppingCartRepository.delete(id);
  }
}
