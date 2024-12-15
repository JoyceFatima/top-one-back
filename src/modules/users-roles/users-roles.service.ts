import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRole } from '../../entities/user-role/user-role.entity';

@Injectable()
export class UsersRolesService {
  constructor(
    @InjectRepository(UserRole)
    private usersRolesRepository: Repository<UserRole>,
  ) {}

  async find(
    where?: Partial<UserRole>,
    relations: string[] = [],
  ): Promise<UserRole[]> {
    return await this.usersRolesRepository.find({ where, relations });
  }

  async insert(data: Partial<UserRole>): Promise<UserRole> {
    return await this.usersRolesRepository.save(data);
  }

  async delete(id: string): Promise<void> {
    const role = await this.usersRolesRepository.findOne({ where: { id } });

    if (!role) throw new NotFoundException('UserRoles not found');

    await this.usersRolesRepository.delete(role.id);
  }
}
