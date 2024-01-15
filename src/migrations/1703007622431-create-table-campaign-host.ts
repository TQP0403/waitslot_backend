import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCampaignHost1703007622431
  implements MigrationInterface
{
  name = "CreateTableCampaignHost1703007622431";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."hosts" ("id" SERIAL NOT NULL, "campaign_id" integer NOT NULL, "display_name" character varying NOT NULL DEFAULT '', "avatar" character varying, "description" character varying DEFAULT false, "type" smallint NOT NULL DEFAULT '0', "priority" smallint NOT NULL DEFAULT '5', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c4bcf0826e0e2847faee4da1746" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."campaigns" ADD "location_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."campaigns" ADD "location_address" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."hosts" ADD CONSTRAINT "FK_3d593b95053184a6fbf74042324" FOREIGN KEY ("campaign_id") REFERENCES "wbxp"."campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."hosts" DROP CONSTRAINT "FK_3d593b95053184a6fbf74042324"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."campaigns" DROP COLUMN "location_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."campaigns" DROP COLUMN "location_name"`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."hosts"`);
  }
}
