import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/enums/role.enum';
import { decryptPassword, encryptPassword } from 'src/utils/funcs';
import { Repository } from 'typeorm';
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

  async find(
    where?: Partial<User>,
    relations: string[] = ['userRole.role'],
  ): Promise<User[]> {
    try {
      return await this.usersRepository.find({ where, relations });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async insert(data: Partial<User>, roleCreate?: Role): Promise<User> {
    try {
      const findUser = await this.usersRepository.findOne({
        where: { email: data.email },
      });

      if (findUser) {
        throw new Error('User already exists');
      }

      const [role] = await this.rolesService.find({ description: roleCreate });
      if (!role) throw new NotFoundException('Role not found');

      if (!data.password) {
        throw new Error('Password is required');
      }

      const password = encryptPassword(data.password);
      const user = await this.usersRepository.save({ ...data, password });
      this.usersRolesService.insert({
        userId: user.id,
        roleId: role.id,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async upsert(data: User, id?: string): Promise<void> {
    const [user] = await this.find({ id });
    if (!user) {
      await this.insert(data);
    } else {
      await this.usersRepository.update(user.id, data);
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

    await this.usersRolesService.delete(user.userRole.id);
    await this.usersRepository.delete(id);
  }
}
