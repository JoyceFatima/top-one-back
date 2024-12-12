import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';

@Entity('users_role')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toClassOnly: false })
  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  userId: string;

  @Exclude({ toClassOnly: false })
  @Column({
    type: 'uuid',
    name: 'role_id',
  })
  roleId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
