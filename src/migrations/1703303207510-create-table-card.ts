import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCard1703303207510 implements MigrationInterface {
  name = "CreateTableCard1703303207510";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" RENAME COLUMN "card" TO "card_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "wbxp"."cards" ("id" SERIAL NOT NULL, "image" character varying, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" DROP COLUMN "card_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" ADD "card_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" ADD CONSTRAINT "FK_80ad48141be648db2d84ff32f79" FOREIGN KEY ("card_id") REFERENCES "wbxp"."cards"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" DROP CONSTRAINT "FK_80ad48141be648db2d84ff32f79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" DROP COLUMN "card_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" ADD "card_id" character varying`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."cards"`);
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" RENAME COLUMN "card_id" TO "card"`,
    );
  }
}
