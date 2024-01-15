import { AdminPermission, AdminRole } from "../admin.enum";

export interface IAdminModel {
  readonly id: number;

  readonly username: string;
  readonly password: string;

  readonly fullname: string;
  readonly description: string;

  readonly role: AdminRole;
  readonly permissions: AdminPermission[];

  readonly enable: boolean;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
