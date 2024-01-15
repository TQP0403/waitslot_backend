import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCampaign1700733465510 implements MigrationInterface {
  name = "CreateTableCampaign1700733465510";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."campaigns" ("id" SERIAL NOT NULL, "title" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "banner" character varying NOT NULL DEFAULT '', "content" character varying NOT NULL DEFAULT '', "priority" smallint NOT NULL DEFAULT '5', "start_time" TIMESTAMP WITH TIME ZONE, "end_time" TIMESTAMP WITH TIME ZONE, "published_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "wbxp"."campaigns"`);
  }
}
