import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class IOrderProducts {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
