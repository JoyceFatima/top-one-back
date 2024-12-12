import { Role } from '@/common/enums/role.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
