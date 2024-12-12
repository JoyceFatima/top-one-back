import { Status } from '@/common/enums';
import { IsNotEmpty, IsString } from 'class-validator';

export class IStatus {
  @IsNotEmpty()
  @IsString()
  status: Status;
}
