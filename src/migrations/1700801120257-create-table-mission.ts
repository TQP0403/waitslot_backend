import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableMission1700801120257 implements MigrationInterface {
  name = "CreateTableMission1700801120257";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."missions" ("id" SERIAL NOT NULL, "campaign_id" integer, "title" character varying NOT NULL, "type" smallint NOT NULL, "rule" integer, "reward_amount" double precision NOT NULL DEFAULT '0', "description" character varying, "enable" boolean NOT NULL DEFAULT true, "start_time" TIMESTAMP WITH TIME ZONE, "end_time" TIMESTAMP WITH TIME ZONE, "link" character varying, "logo" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_787aebb1ac5923c9904043c6309" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wbxp"."do_missions" ("id" SERIAL NOT NULL, "mission_id" integer, "user_id" integer, "reward_amount" double precision NOT NULL DEFAULT '0', "process" integer NOT NULL DEFAULT '1', "is_claimed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_135d645b4325b589f1d5b2925d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."missions" ADD CONSTRAINT "FK_2e3afb4c32481cae836f3fb4326" FOREIGN KEY ("campaign_id") REFERENCES "wbxp"."campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."do_missions" ADD CONSTRAINT "FK_9a3343d95aa6c38cb4964382b6d" FOREIGN KEY ("user_id") REFERENCES "wbxp"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE INDEX "mission_type_idx" ON "wbxp"."missions" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "mission_idx" ON "wbxp"."do_missions" ("mission_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "mission_user_idx" ON "wbxp"."do_missions" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "is_claimed_idx" ON "wbxp"."do_missions" ("is_claimed") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f244acd675720b28179af4e2b2" ON "wbxp"."do_missions" ("user_id", "is_claimed") `,
    );
    await queryRunner.query(
      `CREATE INDEX "mission_endtime_idx" ON "wbxp"."missions" ("end_time") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "wbxp"."mission_endtime_idx"`);
    await queryRunner.query(
      `DROP INDEX "wbxp"."IDX_f244acd675720b28179af4e2b2"`,
    );
    await queryRunner.query(`DROP INDEX "wbxp"."is_claimed_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."mission_user_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."mission_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."mission_type_idx"`);
    await queryRunner.query(
      `ALTER TABLE "wbxp"."do_missions" DROP CONSTRAINT "FK_9a3343d95aa6c38cb4964382b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."missions" DROP CONSTRAINT "FK_2e3afb4c32481cae836f3fb4326"`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."do_missions"`);
    await queryRunner.query(`DROP TABLE "wbxp"."missions"`);
  }
}
