import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
export class RoleController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() role: IRole) {
    try {
      const data = await this.rolesService.insert(role);
      return { message: 'Role created', data };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }
}
