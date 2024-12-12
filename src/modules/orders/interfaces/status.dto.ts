import { IsNotEmpty, IsString } from 'class-validator';
import { Status } from 'src/common/enums';

export class IStatus {
  @IsNotEmpty()
  @IsString()
  status: Status;
}
