import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbInit1734018467737 implements MigrationInterface {
  name = 'DbInit1734018467737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_99e921caf21faa2aab020476e44" UNIQUE ("name"), CONSTRAINT "UQ_b48860677afe62cd96e12659482" UNIQUE ("email"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."roles_name_enum" NOT NULL, "description" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7fd0c79dc4e6083ddea850ac38" ON "roles" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "role_id" uuid, CONSTRAINT "PK_a2cecd1a3531c0b041e29ba46e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_073999dfec9d14522f0cf58cd6" ON "users" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_price" numeric(10,2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'processing', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid, "user_id" uuid, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09b0a39ef7c0b162f6a2f3c860" ON "orders" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order-products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '1', "product_id" uuid, "order_id" uuid, CONSTRAINT "UQ_bdc0068a0d52153034882d60d31" UNIQUE ("order_id", "product_id"), CONSTRAINT "PK_24016ece7c077d34c9fd8bff952" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9efc52af9a0626d0a090a41457" ON "order-products" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_65bfddc52553805125d985089d" ON "order-products" ("order_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "discount" numeric(5,2) NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "category" character varying(255), "imageUrl" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c9fb58de893725258746385e1" ON "products" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff39b9ac40872b2de41751eedc" ON "products" ("isActive") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_718dfbc007ec098cfa28295ca7" ON "products" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "shopping_cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid, "product_id" uuid, CONSTRAINT "PK_40f9358cdf55d73d8a2ad226592" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_role" ADD CONSTRAINT "FK_dff1fd3973cc325e58d8b1f5007" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_role" ADD CONSTRAINT "FK_e3a658640780bef5ec4319c8a0f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" ADD CONSTRAINT "FK_9efc52af9a0626d0a090a414572" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" ADD CONSTRAINT "FK_65bfddc52553805125d985089d0" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_cart" ADD CONSTRAINT "FK_b6c5364d23c79927abac8698802" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_cart" ADD CONSTRAINT "FK_e9714a8554c8b915d109d3de5c9" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_e9714a8554c8b915d109d3de5c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_b6c5364d23c79927abac8698802"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" DROP CONSTRAINT "FK_65bfddc52553805125d985089d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" DROP CONSTRAINT "FK_9efc52af9a0626d0a090a414572"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_role" DROP CONSTRAINT "FK_e3a658640780bef5ec4319c8a0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_role" DROP CONSTRAINT "FK_dff1fd3973cc325e58d8b1f5007"`,
    );
    await queryRunner.query(`DROP TABLE "shopping_cart"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_718dfbc007ec098cfa28295ca7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff39b9ac40872b2de41751eedc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4c9fb58de893725258746385e1"`,
    );
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_65bfddc52553805125d985089d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9efc52af9a0626d0a090a41457"`,
    );
    await queryRunner.query(`DROP TABLE "order-products"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_09b0a39ef7c0b162f6a2f3c860"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_775c9f06fc27ae3ff8fb26f2c4"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_073999dfec9d14522f0cf58cd6"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "users_role"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7fd0c79dc4e6083ddea850ac38"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
