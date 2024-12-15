import { IsString } from 'class-validator';

import { Role } from '@/common/enums/role.enum';

export class IRole {
  @IsString()
  role: Role;
}
