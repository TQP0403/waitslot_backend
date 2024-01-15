import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { IVerificationsModel } from "./verifications.model";

@Entity("verifications")
@Unique("verifications_user_token_unique_constraint", ["username", "token"])
@Index("verifications_user_token_idx", ["username", "token"], { unique: true })
export class Verifications extends BaseEntity implements IVerificationsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("verifications_user_idx", { unique: true })
  @Column({
    name: "username",
    type: "varchar",
    nullable: false,
  })
  username: string;

  @Column({
    name: "token",
    type: "varchar",
    nullable: false,
  })
  token: string;

  @Column({
    name: "expire_time",
    type: "timestamp with time zone",
    nullable: false,
  })
  expireTime: Date;

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
