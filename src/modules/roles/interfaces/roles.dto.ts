import { Role } from '@/common/enums/role.enum';
import { IsString } from 'class-validator';

export class IRole {
  @IsString()
  role: Role;
}
