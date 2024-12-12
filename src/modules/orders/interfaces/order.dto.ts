import { IsArray, IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class IOrder {
  @IsNotEmpty()
  @IsArray()
  shoppingCarts: string[];

  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsNotEmpty()
  @IsArray()
  products: IProducts[];
}

class IProducts {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
