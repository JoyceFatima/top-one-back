import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManyToOne1733951497481 implements MigrationInterface {
    name = 'AddManyToOne1733951497481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "FK_65bfddc52553805125d985089d0"`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "FK_9efc52af9a0626d0a090a414572"`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "UQ_65bfddc52553805125d985089d0"`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "UQ_9efc52af9a0626d0a090a414572"`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "FK_9efc52af9a0626d0a090a414572" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "FK_65bfddc52553805125d985089d0" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "FK_65bfddc52553805125d985089d0"`);
        await queryRunner.query(`ALTER TABLE "order-products" DROP CONSTRAINT "FK_9efc52af9a0626d0a090a414572"`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "UQ_9efc52af9a0626d0a090a414572" UNIQUE ("product_id")`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "UQ_65bfddc52553805125d985089d0" UNIQUE ("order_id")`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "FK_9efc52af9a0626d0a090a414572" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order-products" ADD CONSTRAINT "FK_65bfddc52553805125d985089d0" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
