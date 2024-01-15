import { env } from "@configs/environment-variable";
import { BcryptHelper } from "@helpers/bcrypt.helper";
import { AdminRole } from "@modules/admin/admin.enum";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAdmins1704275762081 implements MigrationInterface {
  name = "CreateTableAdmins1704275762081";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wbxp"."admins" ("id" SERIAL NOT NULL, "fullname" character varying DEFAULT '', "role" character varying NOT NULL DEFAULT 'admin', "permissions" smallint array NOT NULL DEFAULT '{}', "username" character varying NOT NULL, "password" character varying NOT NULL, "enable" boolean NOT NULL DEFAULT true, "description" character varying DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56" UNIQUE ("username"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "admin_username_idx" ON "wbxp"."admins" ("username") `,
    );

    const fullname = "Blockx Super Admin";
    const role: AdminRole = AdminRole.SUPER_ADMIN;
    const { username, password } = env.admin;

    if (password) {
      const hashPassword = await BcryptHelper.generateHash(password);

      await queryRunner.query(
        `INSERT INTO "wbxp"."admins" ("fullname","username","password","role") 
        VALUES ('${fullname}','${username}','${hashPassword}','${role}')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "wbxp"."admin_username_idx"`);
    await queryRunner.query(`DROP TABLE "wbxp"."admins"`);
  }
}
