import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableRewards1700624030666 implements MigrationInterface {
  name = "CreateTableRewards1700624030666";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."rewards" ("id" SERIAL NOT NULL, "description" character varying NOT NULL DEFAULT '', "user_id" integer NOT NULL, "from_id" integer, "reward_amount" double precision NOT NULL DEFAULT '0', "is_claimed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3d947441a48debeb9b7366f8b8c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db43307eb88742aa60b0dff36f" ON "wbxp"."rewards" ("is_claimed") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."rewards" ADD CONSTRAINT "FK_119e21376b9f407077a81c05be2" FOREIGN KEY ("user_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."rewards" DROP CONSTRAINT "FK_119e21376b9f407077a81c05be2"`,
    );
    await queryRunner.query(
      `DROP INDEX "wbxp"."IDX_db43307eb88742aa60b0dff36f"`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."rewards"`);
  }
}
