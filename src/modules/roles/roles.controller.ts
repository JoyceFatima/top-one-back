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
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
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
