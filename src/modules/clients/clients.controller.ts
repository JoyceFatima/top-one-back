import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/decorator/roles.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { IClient } from './interfaces/clients.dto';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(@Query('relations') relations?: string[]) {
    try {
      const clients = await this.clientsService.find({}, relations);
      return { message: 'Success', data: clients, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const client = await this.clientsService.findOne({ id });
      return { message: 'Success', data: client, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Post()
  async create(@Body() client: IClient) {
    try {
      const newClient = await this.clientsService.insert(client);
      return {
        message: 'Client created successfully',
        data: newClient,
        statusCode: 201,
      };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() client: Partial<IClient>) {
    try {
      await this.clientsService.update(id, client);
      return { message: 'Client updated successfully', statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.clientsService.delete(id);
      return { message: 'Client deleted successfully', statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }
}
