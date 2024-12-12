import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorTables1734008482222 implements MigrationInterface {
    name = 'RefactorTables1734008482222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "category" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "imageUrl" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."roles_name_enum" AS ENUM('admin', 'seller')`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" "public"."roles_name_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "users_role" DROP CONSTRAINT "FK_dff1fd3973cc325e58d8b1f5007"`);
        await queryRunner.query(`ALTER TABLE "users_role" DROP CONSTRAINT "FK_e3a658640780bef5ec4319c8a0f"`);
        await queryRunner.query(`ALTER TABLE "users_role" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_role" ALTER COLUMN "role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "client_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "FK_9efc52af9a0626d0a090a414572"`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "FK_65bfddc52553805125d985089d0"`);
        await queryRunner.query(`ALTER TABLE "order-products" ALTER COLUMN "product_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order-products" ALTER COLUMN "order_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_b6c5364d23c79927abac8698802"`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_e9714a8554c8b915d109d3de5c9"`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" ALTER COLUMN "client_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" ALTER COLUMN "product_id" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_7fd0c79dc4e6083ddea850ac38" ON "roles" ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_073999dfec9d14522f0cf58cd6" ON "users" ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_09b0a39ef7c0b162f6a2f3c860" ON "orders" ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_9efc52af9a0626d0a090a41457" ON "order-products" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_65bfddc52553805125d985089d" ON "order-products" ("order_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c9fb58de893725258746385e1" ON "products" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff39b9ac40872b2de41751eedc" ON "products" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_718dfbc007ec098cfa28295ca7" ON "products" ("deleted_at") `);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "UQ_bdc0068a0d52153034882d60d31" UNIQUE ("order_id", "product_id")`);
        await queryRunner.query(`ALTER TABLE "users_role" ADD CONSTRAINT "FK_dff1fd3973cc325e58d8b1f5007" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_role" ADD CONSTRAINT "FK_e3a658640780bef5ec4319c8a0f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "FK_9efc52af9a0626d0a090a414572" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "FK_65bfddc52553805125d985089d0" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" ADD CONSTRAINT "FK_b6c5364d23c79927abac8698802" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" ADD CONSTRAINT "FK_e9714a8554c8b915d109d3de5c9" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_e9714a8554c8b915d109d3de5c9"`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_b6c5364d23c79927abac8698802"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70"`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "FK_65bfddc52553805125d985089d0"`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "FK_9efc52af9a0626d0a090a414572"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4"`);
        await queryRunner.query(`ALTER TABLE "users_role" DROP CONSTRAINT "FK_e3a658640780bef5ec4319c8a0f"`);
        await queryRunner.query(`ALTER TABLE "users_role" DROP CONSTRAINT "FK_dff1fd3973cc325e58d8b1f5007"`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "UQ_bdc0068a0d52153034882d60d31"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_718dfbc007ec098cfa28295ca7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff39b9ac40872b2de41751eedc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c9fb58de893725258746385e1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65bfddc52553805125d985089d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9efc52af9a0626d0a090a41457"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_09b0a39ef7c0b162f6a2f3c860"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_775c9f06fc27ae3ff8fb26f2c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_073999dfec9d14522f0cf58cd6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7fd0c79dc4e6083ddea850ac38"`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" ALTER COLUMN "product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" ALTER COLUMN "client_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" ADD CONSTRAINT "FK_e9714a8554c8b915d109d3de5c9" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" ADD CONSTRAINT "FK_b6c5364d23c79927abac8698802" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_4c9fb58de893725258746385e16"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order-products" ALTER COLUMN "order_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order-products" ALTER COLUMN "product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "FK_65bfddc52553805125d985089d0" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "FK_9efc52af9a0626d0a090a414572" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "client_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_role" ALTER COLUMN "role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_role" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_role" ADD CONSTRAINT "FK_e3a658640780bef5ec4319c8a0f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_role" ADD CONSTRAINT "FK_dff1fd3973cc325e58d8b1f5007" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "quantity" integer NOT NULL DEFAULT '1'`);
    }

}
