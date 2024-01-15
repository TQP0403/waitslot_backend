import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableParticipants1703235096776
  implements MigrationInterface
{
  name = "CreateTableParticipants1703235096776";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."participants" ("id" SERIAL NOT NULL, "campaign_id" integer NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1cda06c31eec1c95b3365a0283f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."participants" ADD CONSTRAINT "FK_cd6b4bfcdd07088070ad89cc2b2" FOREIGN KEY ("campaign_id") REFERENCES "wbxp"."campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."participants" ADD CONSTRAINT "FK_1427a77e06023c250ed3794a1ba" FOREIGN KEY ("user_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."participants" DROP CONSTRAINT "FK_1427a77e06023c250ed3794a1ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."participants" DROP CONSTRAINT "FK_cd6b4bfcdd07088070ad89cc2b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."tickets" ADD "description" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."tickets" ADD "title" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."participants"`);
  }
}
