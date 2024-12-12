import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../user-role/user-role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Unique username for the user',
    example: 'johndoe',
    required: true,
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    description: 'Unique email address for the user',
    example: 'user@example.com',
    required: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Encrypted password for the user',
    example: 'hashed_password_here',
    required: true,
  })
  @Exclude({ toClassOnly: false })
  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  @Index()
  deletedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    eager: true,
    cascade: true,
  })
  userRoles: UserRole[];
}
