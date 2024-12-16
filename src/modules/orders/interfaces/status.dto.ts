import { IsNotEmpty, IsString } from 'class-validator';

import { Status } from '@/common/enums';

export class IStatus {
  @IsNotEmpty()
  @IsString()
  status: Status;
}
