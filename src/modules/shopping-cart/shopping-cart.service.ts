import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCart } from '../../entities/shopping-cart/shopping-cart.entity';
import { ClientsService } from '../clients/clients.service';
import { ProductService } from '../products/product.service';
import { IShoppingCart } from './interfaces/shopping-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
    private productService: ProductService,
    private clientService: ClientsService,
  ) {}

  async findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartRepository.find();
  }

  async addToCart(data: IShoppingCart): Promise<ShoppingCart> {
    const client = await this.clientService.findOne({ id: data.clientId });
    if (!client) throw new NotFoundException('Client not found');

    const product = await this.productService.findOne(data.productId);
    if (!product) throw new NotFoundException('Product not found');

    const existingCartItem = await this.shoppingCartRepository.findOne({
      where: { client: { id: client.id }, product: { id: product.id } },
    });

    if (existingCartItem) {
      existingCartItem.quantity += data.quantity;
      return await this.shoppingCartRepository.save(existingCartItem);
    }

    return await this.shoppingCartRepository.save({
      quantity: data.quantity,
      client,
      product,
    });
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

  async delete(id: string): Promise<void> {
    const cartItem = await this.shoppingCartRepository.findOne({
      where: { id },
    });
    if (!cartItem) throw new NotFoundException('Item not found in the cart');
    await this.shoppingCartRepository.delete(id);
  }
}
