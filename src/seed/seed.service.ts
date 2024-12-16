import { Injectable } from '@nestjs/common';

import { Role } from '@/common/enums';
import { Client } from '@/entities/clients/clients.entity';
import { User } from '@/entities/users/user.entity';
import { ClientsService } from '@/modules/clients/clients.service';
import { IOrder } from '@/modules/orders/interfaces/order.dto';
import { OrdersService } from '@/modules/orders/order.service';
import { IProduct } from '@/modules/products/interfaces/product.dto';
import { ProductService } from '@/modules/products/product.service';
import { RolesService } from '@/modules/roles/roles.service';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
    private readonly clientsService: ClientsService,
    private readonly productsService: ProductService,
    private readonly ordersService: OrdersService,
  ) {}

  async roles() {
    const roles: Role[] = [Role.ADMIN, Role.SELLER];

    for (const role of roles) {
      const existingRole = await this.rolesService.find();
      if (existingRole.some((r) => r.name === role)) {
        continue;
      }

      await this.rolesService.insert({ role });
    }
  }

  async users() {
    const admins: Partial<User>[] = [
      {
        username: 'John',
        email: 'john@admin.com',
        password: 'Password@123',
      },
      {
        username: 'Jane',
        email: 'jane@admin.com',
        password: 'Password@123',
      },
    ];

    const sellers: Partial<User>[] = [
      {
        username: 'Dave',
        email: 'dave@seller.com',
        password: 'Password@123',
      },
      {
        username: 'Mary',
        email: 'mary@seller.com',
        password: 'Password@123',
      },
    ];

    for (const user of [...admins, ...sellers]) {
      const existingUser = await this.userService.findOne({
        email: user.email,
      });
      if (existingUser) {
        continue;
      }

      await this.userService.insert(
        {
          ...user,
        },
        admins.includes(user) ? Role.ADMIN : Role.SELLER,
      );
    }
  }

  async clients() {
    const clients: Partial<Client>[] = [
      {
        name: 'Rick Sanchez',
        email: 'rick@client.com',
      },
      {
        name: 'Morty Smith',
        email: 'morty@client.com',
      },
    ];

    for (const client of clients) {
      const existingClient = await this.clientsService.findOne({
        email: client.email,
      });
      if (existingClient) {
        continue;
      }

      await this.clientsService.insert({
        ...client,
      });
    }
  }

  async products() {
    const user = await this.userService.findOne({
      email: 'john@admin.com',
    });
    const products: IProduct[] = [
      {
        name: 'Product 1',
        description: 'Description for product 1',
        price: 100,
        discount: 10,
        stock: 100,
        imageUrl:
          'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2024/07/10/1572679108-cha-de-alecrim-para-que-serve.jpg',
      },
      {
        name: 'Product 2',
        description: 'Description for product 2',
        price: 200,
        discount: 20,
        stock: 200,
        imageUrl:
          'https://nutritotal.com.br/publico-geral/wp-content/uploads/2022/06/Cha_Hortela_Nutritotal_Para_Todos_novosite.png',
      },
    ];

    for (const product of products) {
      const products = await this.productsService.findAll();

      const existingProduct = products.find((p) => p.name === product.name);

      if (existingProduct) {
        continue;
      }

      await this.productsService.createProduct(user, product);
    }
  }

  async orders() {
    const user = await this.userService.findOne({
      email: 'john@admin.com',
    });
    const client = await this.clientsService.findOne({
      email: 'rick@client.com',
    });
    const products = await this.productsService.findAll();

    const order: IOrder = {
      clientId: client.id,
      shoppingCarts: [],
      products: [
        {
          id: products[0].id,
          quantity: 10,
        },
        {
          id: products[1].id,
          quantity: 20,
        },
      ],
    };

    await this.ordersService.create(user, order);
  }

  async run() {
    await this.roles();
    await this.users();
    await this.clients();
    await this.products();
    await this.orders();
  }
}
