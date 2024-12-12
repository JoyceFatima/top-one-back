import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/decorator/roles.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { getToken } from '@/utils/funcs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IProduct } from './interfaces/product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    try {
      const data = await this.productService.findAll();
      return { message: 'Success', data };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Post()
  async createProduct(
    @Headers('Authorization') authHeader: string,
    @Body() productData: IProduct,
  ) {
    try {
      const token = getToken(authHeader);
      const data = await this.productService.createProduct(token, productData);
      return { message: 'Product created', data };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: Partial<IProduct>,
  ) {
    try {
      const data = await this.productService.updateProduct(productData, id);
      return { message: 'Product updated', data };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Patch(':id/discount')
  async applyDiscount(
    @Param('id') id: string,
    @Body('discount') discount: number,
  ) {
    try {
      const data = await this.productService.applyDiscount(id, discount);
      return { message: 'Discount applied', data };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      await this.productService.deleteProduct(id);
      return { message: 'Product deleted', statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }
}
