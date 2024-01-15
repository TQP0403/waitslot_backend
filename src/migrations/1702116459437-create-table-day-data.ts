import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableDayData1702116459437 implements MigrationInterface {
  name = "CreateTableDayData1702116459437";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."day_data" ("id" SERIAL NOT NULL, "date" date NOT NULL, "total_balance" double precision NOT NULL DEFAULT '0', "total_holder" double precision NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b05dfe988e18f51b99b8705b953" UNIQUE ("date"), CONSTRAINT "PK_9674b313b01a8606b8c4515aedd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "date_day_data_idx" ON "wbxp"."day_data" ("date") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "wbxp"."date_day_data_idx"`);
    await queryRunner.query(`DROP TABLE "wbxp"."day_data"`);
  }
}
