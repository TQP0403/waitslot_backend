import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLuckyBox1700213891918 implements MigrationInterface {
  name = "CreateTableLuckyBox1700213891918";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."lucky_boxes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" smallint NOT NULL DEFAULT '0', "wbxp_amount" double precision NOT NULL DEFAULT '0', "limit" integer, "image" character varying, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f28f77ccf0cd86ded8993a83ecd" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "wbxp"."lucky_boxes"`);
  }
}
