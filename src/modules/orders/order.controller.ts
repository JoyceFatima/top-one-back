import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Status } from '@/common/enums';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/decorator/roles.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { decodeToken, getToken } from '@/utils/funcs';

import { IOrder } from './interfaces/order.dto';
import { IStatus } from './interfaces/status.dto';
import { OrdersService } from './order.service';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.SELLER)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('status') status?: Status,
    @Query('clientId') clientId?: string,
    @Query('userId') userId?: string,
  ) {
    try {
      const where: any = {};
      if (status) where.status = status;
      if (clientId) where.client = { id: clientId };
      if (userId) where.user = { id: userId };

      const data = await this.ordersService.findAll(where);

      return {
        message: 'Success',
        data,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        message: error.message,
        statusCode: 400,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.ordersService.findOne(id);
      return { message: 'Success', data, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Post()
  async create(
    @Headers('Authorization') authHeader: string,
    @Body() orderData: IOrder,
  ) {
    try {
      const token = getToken(authHeader);
      const user = decodeToken(token);
      const data = await this.ordersService.create(user, orderData);
      return { message: 'Order created', data, statusCode: 201 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Put(':id/update-status')
  async updateStatus(@Param('id') id: string, @Body() body: IStatus) {
    try {
      const data = await this.ordersService.updateStatus(id, body);
      return { message: 'Order updated', data, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.ordersService.delete(id);
      return { message: 'Order deleted', statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }
}
