import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { capitalize } from '@/utils/funcs';

import { Role } from '../../entities/roles/role.entity';

import { IRole } from './interfaces/roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async find(where?: Partial<Role>): Promise<Role[]> {
    return await this.rolesRepository.find({ where });
  }

  async insert(data: IRole): Promise<Role> {
    const result = await this.rolesRepository.save({
      name: data.role,
      description: capitalize(data.role),
    });
    return result;
  }

  async delete(id: string): Promise<void> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) throw new NotFoundException('Roles not found');

    await this.rolesRepository.delete(role.id);
  }
}
