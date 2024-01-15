import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLuckyShaking1703729523177
  implements MigrationInterface
{
  name = "CreateTableLuckyShaking1703729523177";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."lucky_shaking" ("id" SERIAL NOT NULL, "from_id" integer, "to_id" integer NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f7cafd8df077c8ba4b3c15c22ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."lucky_shaking" ADD CONSTRAINT "FK_2dc280487bc61a04587608b0e72" FOREIGN KEY ("from_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."lucky_shaking" ADD CONSTRAINT "FK_2022f177539858d47922dccc4a0" FOREIGN KEY ("to_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."lucky_shaking" DROP CONSTRAINT "FK_2022f177539858d47922dccc4a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."lucky_shaking" DROP CONSTRAINT "FK_2dc280487bc61a04587608b0e72"`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."lucky_shaking"`);
  }
}
