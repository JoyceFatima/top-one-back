import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '@/common/enums/role.enum';
import { decryptPassword, encryptPassword } from '@/utils/funcs';

import { User } from '../../entities/users/user.entity';
import { RolesService } from '../roles/roles.service';
import { UsersRolesService } from '../users-roles/users-roles.service';

import { IChangePassword } from './interfaces/change-password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
    private usersRolesService: UsersRolesService,
  ) {}

  async find(where?: Partial<User>): Promise<User[]> {
    try {
      return await this.usersRepository.find({ where });
    } catch {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async findOne(where?: Partial<User>): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where });
      return user;
    } catch {
      throw new InternalServerErrorException('Error retrieving user');
    }
  }

  async insert(data: Partial<User>, roleName?: Role): Promise<User> {
    try {
      const findUser = await this.usersRepository.findOne({
        where: { email: data.email },
      });

      if (findUser) {
        throw new Error('User already exists');
      }

      const [role] = await this.rolesService.find({ name: roleName });
      if (!role) throw new NotFoundException('Role not found');

      if (!data.password) {
        throw new Error('Password is required');
      }

      const password = encryptPassword(data.password);
      const user = await this.usersRepository.save({ ...data, password });
      this.usersRolesService.insert({
        user,
        role,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async upsert(data: User, id?: string): Promise<void> {
    const [user] = await this.find({ id });

    if (!user) {
      await this.insert(data, data.userRoles[0].role.name);
    } else {
      for (const role of user.userRoles) {
        await this.usersRolesService.delete(role.id);
      }
      const userUpdated = await this.usersRepository.save(data);

      this.usersRolesService.insert({
        user: userUpdated,
        role: data.userRoles[0].role,
      });
    }
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    const [user] = await this.find({ id });
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.update(id, data);
  }

  async changePassword(
    userId: string,
    passwords: IChangePassword,
  ): Promise<void> {
    const { password, newPassword } = passwords;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isOldPasswordValid = decryptPassword(password, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    user.password = encryptPassword(newPassword);
    await this.usersRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const [user] = await this.find({ id });
    if (!user) throw new NotFoundException('User not found');

    for (const role of user.userRoles) {
      await this.usersRolesService.delete(role.id);
    }
    await this.usersRepository.delete(id);
  }
}
