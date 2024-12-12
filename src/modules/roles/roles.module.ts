import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../entities/roles/role.entity';
import { RolesService } from './roles.service';

@Module({
  controllers: [],
  providers: [RolesService],
  exports: [RolesService],
  imports: [TypeOrmModule.forFeature([Role])],
})
export class RolesModule {}
