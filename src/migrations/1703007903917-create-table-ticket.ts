import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTicket1703007903917 implements MigrationInterface {
  name = "CreateTableTicket1703007903917";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."tickets" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "campaign_id" integer NOT NULL, "title" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "price" double precision NOT NULL DEFAULT '0', "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."tickets" ADD CONSTRAINT "FK_2e445270177206a97921e461710" FOREIGN KEY ("user_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."tickets" ADD CONSTRAINT "FK_4b84da948cc37b5405b396afc31" FOREIGN KEY ("campaign_id") REFERENCES "wbxp"."campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."tickets" DROP CONSTRAINT "FK_4b84da948cc37b5405b396afc31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."tickets" DROP CONSTRAINT "FK_2e445270177206a97921e461710"`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."tickets"`);
  }
}
