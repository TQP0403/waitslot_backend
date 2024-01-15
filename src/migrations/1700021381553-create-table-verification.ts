import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableVerification1700021381553
  implements MigrationInterface
{
  name = "CreateTableVerification1700021381553";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."verifications" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "token" character varying NOT NULL, "expire_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_d55acdc51cfb95166173c227e60" UNIQUE ("username"), CONSTRAINT "PK_2127ad1b143cf012280390b01d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "verifications_user_idx" ON "wbxp"."verifications" ("username") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "verifications_user_token_idx" ON "wbxp"."verifications" ("username", "token") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."verifications" ADD CONSTRAINT "verifications_user_token_unique_constraint" UNIQUE ("username", "token")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."verifications" DROP CONSTRAINT "verifications_user_token_unique_constraint"`,
    );
    await queryRunner.query(`DROP INDEX "wbxp"."verifications_user_token_idx"`);
    await queryRunner.query(`DROP INDEX "wbxp"."verifications_user_idx"`);
    await queryRunner.query(`DROP TABLE "wbxp"."verifications"`);
  }
}
