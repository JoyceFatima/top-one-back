import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/users/user.entity';
import { RolesModule } from '../roles/roles.module';
import { UsersRolesModule } from '../users-roles/users-roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), RolesModule, UsersRolesModule],
})
export class UsersModule {}
