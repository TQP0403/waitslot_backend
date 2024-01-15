import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IUserModel } from "./user.model";
import { IUserResponse } from "../interfaces/user.interface";

@Entity("users")
export class User extends BaseEntity implements IUserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "bio",
    type: "varchar",
    nullable: true,
    default: "",
  })
  bio: string;

  @Index("username_idx", { unique: true })
  @Column({
    name: "username",
    type: "varchar",
    nullable: false,
    unique: true,
  })
  username: string;

  @Index("user_email_idx")
  @Column({
    name: "email",
    type: "varchar",
    nullable: true,
  })
  email: string;

  @Index("user_phone_idx")
  @Column({
    name: "phone",
    type: "varchar",
    nullable: true,
  })
  phone: string;

  @Column({
    name: "waiting_slot",
    type: "integer",
    nullable: false,
  })
  waitingSlot: number;

  @Column({
    name: "wbxp_balance",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  wbxpBalance: number;

  @Column({
    name: "commission_amount",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  commissionAmount: number;

  @Index("ref_name_idx", { unique: true })
  @Column({
    name: "ref_name",
    type: "varchar",
    nullable: false,
    unique: true,
  })
  refName: string;

  @Column({
    name: "ref_count",
    type: "integer",
    nullable: false,
    default: 0,
  })
  refCount: number;

  @Index("ref_idx")
  @Column({
    name: "ref_by_id",
    type: "integer",
    nullable: true,
  })
  refById: number;

  @Column({
    name: "avatar",
    type: "varchar",
    nullable: true,
  })
  avatar: string;

  @Column({
    name: "fullname",
    type: "varchar",
    nullable: true,
  })
  fullname: string;

  @Column({
    name: "is_kyc_email",
    type: "boolean",
    nullable: false,
    default: false,
  })
  isKycEmail: boolean;

  @Column({
    name: "is_kyc_phone",
    type: "boolean",
    nullable: false,
    default: false,
  })
  isKycPhone: boolean;

  @Column({
    name: "enable",
    type: "boolean",
    nullable: false,
    default: true,
  })
  enable: boolean;

  @Column({
    name: "checkin_count",
    type: "integer",
    nullable: false,
    default: 0,
  })
  checkinCount: number;

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

  public getResponse(totalWaitingSlot?: number): IUserResponse {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      fullname: this.fullname,
      avatar: this.avatar,
      bio: this.bio,
      waitingSlot: this.waitingSlot,
      totalWaitingSlot: totalWaitingSlot ?? 0,
      wbxpBalance: this.wbxpBalance,
      refName: this.refName,
      refCount: this.refCount,
      checkinCount: this.checkinCount,
    };
  }
}
