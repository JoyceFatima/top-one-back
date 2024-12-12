import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class IClient {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
