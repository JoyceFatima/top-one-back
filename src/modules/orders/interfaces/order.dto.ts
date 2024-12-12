import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class IOrder {
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  totalPrice: number;
}
