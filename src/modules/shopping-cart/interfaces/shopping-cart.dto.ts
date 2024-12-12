import { IsInt, IsUUID, Min } from 'class-validator';

export class IShoppingCart {
  @IsUUID()
  clientId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
