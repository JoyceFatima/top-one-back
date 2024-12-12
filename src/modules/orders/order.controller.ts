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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Status } from 'src/common/enums';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { getToken } from 'src/utils/funcs';
import { IOrder } from './interfaces/order.dto';
import { IStatus } from './interfaces/status.dto';
import { OrdersService } from './order.service';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  // @Roles(Role.SELLER)
  async findAll(@Query('status') status?: Status) {
    try {
      const data = await this.ordersService.findAll(status);
      return { message: 'Success', data, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Get(':id')
  // @Roles(Role.SELLER)
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.ordersService.findOne(id);
      return { message: 'Success', data, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Get('client/:id')
  // @Roles(Role.SELLER)
  async findByClient(@Param('id') clientId: string) {
    try {
      const data = await this.ordersService.findByClient(clientId);
      return { message: 'Success', data, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Post()
  // @Roles(Role.SELLER)
  async create(
    @Headers('Authorization') authHeader: string,
    @Body() orderData: IOrder,
  ) {
    try {
      const token = getToken(authHeader);
      const data = await this.ordersService.create(token, orderData);
      return { message: 'Order created', data, statusCode: 201 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Put(':id')
  // @Roles(Role.SELLER)
  async update(@Param('id') id: string, @Body() orderData: Partial<IOrder>) {
    try {
      const data = await this.ordersService.update(id, orderData);
      return { message: 'Order updated', data, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Patch(':id/update-status')
  // @Roles(Role.SELLER)
  async updateStatus(@Param('id') id: string, @Body() body: IStatus) {
    try {
      const data = await this.ordersService.updateStatus(id, body);
      return { message: 'Order updated', data, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Delete(':id')
  // @Roles(Role.SELLER)
  async delete(@Param('id') id: string) {
    try {
      await this.ordersService.delete(id);
      return { message: 'Order deleted', statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }
}
