import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IAdminModel } from "./admin.model";
import { AdminPermission, AdminRole } from "../admin.enum";

@Entity("admins")
export class Admin extends BaseEntity implements IAdminModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "fullname",
    type: "varchar",
    nullable: true,
    default: "",
  })
  fullname: string;

  @Column({
    name: "role",
    type: "varchar",
    nullable: false,
    default: AdminRole.ADMIN,
  })
  role: AdminRole;

  @Column({
    name: "permissions",
    type: "int2",
    array: true,
    nullable: false,
    default: [],
  })
  permissions: AdminPermission[];

  @Index("admin_username_idx", { unique: true })
  @Column({
    name: "username",
    type: "varchar",
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    name: "password",
    type: "varchar",
    nullable: false,
  })
  password: string;

  @Column({
    name: "description",
    type: "varchar",
    nullable: true,
    default: "",
  })
  description: string;

  @Column({
    name: "enable",
    type: "boolean",
    nullable: false,
    default: true,
  })
  enable: boolean;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp with time zone",
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp with time zone",
  })
  updatedAt?: Date;
}
