import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserDayData1701943638892 implements MigrationInterface {
  name = "CreateTableUserDayData1701943638892";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."user_day_data" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "date" date NOT NULL, "ref_count" integer NOT NULL DEFAULT '0', "balance" double precision NOT NULL DEFAULT '0', "commission" double precision NOT NULL DEFAULT '0', "network_revenue" double precision NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4acf574387b2ddfeddda0578ce4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_day_data_idx" ON "wbxp"."user_day_data" ("user_id", "date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "user_day_data_user_idx" ON "wbxp"."user_day_data" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."user_day_data" ADD CONSTRAINT "FK_f311d77ba05ad92477238d1c0ba" FOREIGN KEY ("user_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."user_day_data" DROP CONSTRAINT "FK_f311d77ba05ad92477238d1c0ba"`,
    );
    await queryRunner.query(`DROP INDEX "wbxp"."user_day_data_user_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."user_day_data_idx"`);
    await queryRunner.query(`DROP TABLE "wbxp"."user_day_data"`);
  }
}
