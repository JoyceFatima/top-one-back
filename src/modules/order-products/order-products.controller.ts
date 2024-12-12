import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { OrderProductsService } from './order-products.service';

@ApiTags('Order Products')
@Controller('order-products')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class OrderProductsController {
  constructor(private readonly orderProductService: OrderProductsService) {}

  @Get()
  async findAll() {
    try {
      const data = await this.orderProductService.findAll();
      return { message: 'Success', data };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  // @Post()
  // async createOrderProducts(
  //   @Headers('Authorization') authHeader: string,
  //   @Body() productData: IOrderProducts,
  // ) {
  //   try {
  //     const token = getToken(authHeader);
  //     const data = await this.orderProductService.createProduct(
  //       token,
  //       productData,
  //     );
  //     return { message: 'Product created', data };
  //   } catch (error) {
  //     throw { message: error.message, statusCode: 400 };
  //   }
  // }

  // @Put(':id')
  // async updateOrderProducts(
  //   @Param('id') id: string,
  //   @Body() productData: Partial<IOrderProducts>,
  // ) {
  //   try {
  //     const data = await this.orderProductService.updateProduct(
  //       productData,
  //       id,
  //     );
  //     return { message: 'Product updated', data };
  //   } catch (error) {
  //     throw { message: error.message, statusCode: 400 };
  //   }
  // }

  // @Delete(':id')
  // async deleteOrderProducts(@Param('id') id: string) {
  //   try {
  //     await this.orderProductService.deleteProduct(id);
  //     return { message: 'Product deleted', statusCode: 200 };
  //   } catch (error) {
  //     throw { message: error.message, statusCode: 400 };
  //   }
  // }
}
