import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTransaction1700801261029 implements MigrationInterface {
  name = "CreateTableTransaction1700801261029";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."transactions" ("id" SERIAL NOT NULL, "from_id" integer, "to_id" integer NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "type" smallint NOT NULL DEFAULT '0', "card" character varying, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" ADD CONSTRAINT "FK_811faa40e043801b0a4b3737d27" FOREIGN KEY ("from_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" ADD CONSTRAINT "FK_7f681ce46f24957781c744c3561" FOREIGN KEY ("to_id") REFERENCES "wbxp"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" DROP CONSTRAINT "FK_7f681ce46f24957781c744c3561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wbxp"."transactions" DROP CONSTRAINT "FK_811faa40e043801b0a4b3737d27"`,
    );
    await queryRunner.query(`DROP TABLE "wbxp"."transactions"`);
  }
}
