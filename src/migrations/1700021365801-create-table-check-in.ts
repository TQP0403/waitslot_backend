import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCheckIn1700021365801 implements MigrationInterface {
  name = "CreateTableCheckIn1700021365801";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."check_ins" ("id" SERIAL NOT NULL, "check_in_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_fac7f27bc829a454ad477c13f62" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."check_ins" ADD CONSTRAINT "FK_7b8c2fc47cf37006c80fc5e80a9" FOREIGN KEY ("user_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."check_ins" DROP CONSTRAINT "FK_7b8c2fc47cf37006c80fc5e80a9"`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."check_ins"`);
  }
}
