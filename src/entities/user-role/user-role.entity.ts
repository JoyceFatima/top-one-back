import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';

@Entity('users_role')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.id, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
