import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../../entities/user-role/user-role.entity';
import { UsersRolesService } from './users-roles.service';

@Module({
  controllers: [],
  providers: [UsersRolesService],
  exports: [UsersRolesService],
  imports: [TypeOrmModule.forFeature([UserRole])],
})
export class UsersRolesModule {}
