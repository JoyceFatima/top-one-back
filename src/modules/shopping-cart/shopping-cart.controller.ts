import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/guards/auth.guard';

import { IShoppingCart } from './interfaces/shopping-cart.dto';
import { ShoppingCartService } from './shopping-cart.service';

@ApiTags('Shopping Cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  @UseGuards(new AuthGuard())
  async findAll() {
    try {
      const data = await this.shoppingCartService.findAll();
      return { message: 'Success', data };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseGuards(new AuthGuard())
  async addToCart(@Body() cartData: IShoppingCart) {
    try {
      await this.shoppingCartService.addToCart(cartData);
      return {
        message: 'Added to cart',
        data: await this.shoppingCartService.findAll(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  async updateCartItem(
    @Param('id') id: string,
    @Body() cartData: Partial<IShoppingCart>,
  ) {
    try {
      const data = await this.shoppingCartService.updateCartItem(id, cartData);
      return { message: 'Updated cart item', data };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async delete(@Param('id') id: string) {
    try {
      await this.shoppingCartService.delete(id);
      return { message: 'Removed from cart' };
    } catch (error) {
      throw error;
    }
  }
}
