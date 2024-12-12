import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/roles/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async find(where?: Partial<Role>, relations: string[] = []): Promise<Role[]> {
    return await this.rolesRepository.find({ where, relations });
  }

  // async insert(data: Partial<Role>): Promise<Role> {
  //   return await this.rolesRepository.save(data);
  // }

  async delete(id: string): Promise<void> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) throw new NotFoundException('Roles not found');

    await this.rolesRepository.delete(role.id);
  }
}
