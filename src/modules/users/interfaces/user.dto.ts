import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Role } from '@/common/enums/role.enum';

export class IUser {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
