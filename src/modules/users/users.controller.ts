import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from '../../entities/users/user.entity';
import { IChangePassword } from './interfaces/change-password';
import { IUser } from './interfaces/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    try {
      const res = await this.usersService.find({});
      return { message: 'Success', data: res, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    try {
      const res = await this.usersService.findOne({ id });
      return { message: 'Success', data: res, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Post()
  async create(@Body() user: IUser) {
    try {
      const res = await this.usersService.insert(user, user.role);
      return { message: 'Success', data: res, statusCode: 201 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async upsert(@Body() user: User, @Param('id') id?: string) {
    try {
      const res = await this.usersService.upsert(user, id);
      return { message: 'Success', data: res, statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() user: Partial<User>) {
    try {
      await this.usersService.update(id, user);
      return { message: 'Updated', statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async changePassword(
    @Param('id') id: string,
    @Body() passwords: IChangePassword,
  ) {
    try {
      await this.usersService.changePassword(id, passwords);
      return { message: 'Password updated successfully', statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.delete(id);
      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }
}
