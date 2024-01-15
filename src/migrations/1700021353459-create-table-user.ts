import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUser1700021353459 implements MigrationInterface {
  name = "CreateTableUser1700021353459";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "avatar" character varying, "fullname" character varying, "username" character varying NOT NULL, "email" character varying, "phone" character varying, "waiting_slot" integer NOT NULL, "wbxp_balance" double precision NOT NULL DEFAULT '0', "commission_amount" double precision NOT NULL DEFAULT '0', "ref_name" character varying NOT NULL, "ref_count" integer NOT NULL DEFAULT '0', "ref_by_id" integer, "is_kyc_email" boolean NOT NULL DEFAULT false, "is_kyc_phone" boolean NOT NULL DEFAULT false, "enable" boolean NOT NULL DEFAULT true, "checkin_count" integer NOT NULL DEFAULT '0', "bio" character varying DEFAULT '', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_e239429bd6bf94aeccdf50a3fe8" UNIQUE ("ref_name"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "username_idx" ON "wbxp"."users" ("username") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "ref_name_idx" ON "wbxp"."users" ("ref_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "user_email_idx" ON "wbxp"."users" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "user_phone_idx" ON "wbxp"."users" ("phone") `,
    );
    await queryRunner.query(
      `CREATE INDEX "ref_idx" ON "wbxp"."users" ("ref_by_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "wbxp"."ref_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."user_phone_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."user_email_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."ref_name_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."username_idx"`);
    await queryRunner.query(`DROP TABLE "wbxp"."users"`);
  }
}
