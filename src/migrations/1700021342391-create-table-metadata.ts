import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableMetadata1700021342391 implements MigrationInterface {
  name = "CreateTableMetadata1700021342391";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."metadata" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "total_waiting_slot" integer NOT NULL DEFAULT '0', "lucky_shaking_reward" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_56b22355e89941b9792c04ab176" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "wbxp"."metadata" ("total_waiting_slot") VALUES (0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "wbxp"."metadata"`);
  }
}
