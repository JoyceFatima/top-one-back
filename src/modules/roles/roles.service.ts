import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { capitalize } from 'src/utils/funcs';
import { Repository } from 'typeorm';
import { Role } from '../../entities/roles/role.entity';
import { IRole } from './interfaces/roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async find(where?: Partial<Role>, relations: string[] = []): Promise<Role[]> {
    return await this.rolesRepository.find({ where, relations });
  }

  async insert(data: IRole): Promise<Role> {
    return await this.rolesRepository.save({
      name: data.role,
      description: capitalize(data.role),
    });
  }

  async delete(id: string): Promise<void> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) throw new NotFoundException('Roles not found');

    await this.rolesRepository.delete(role.id);
  }
}
