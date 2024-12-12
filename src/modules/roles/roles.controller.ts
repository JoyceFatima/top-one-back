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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IRole } from './interfaces/roles.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll() {
    try {
      const data = await this.rolesService.find();
      return { message: 'Roles retrieved', data };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Post()
  async createRole(@Body() role: IRole) {
    try {
      const data = await this.rolesService.insert(role);
      return { message: 'Role created', data };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    try {
      await this.rolesService.delete(id);
      return { message: 'Role deleted successfully' };
    } catch (error) {
      throw { message: error.message, statusCode: 404 };
    }
  }
}
