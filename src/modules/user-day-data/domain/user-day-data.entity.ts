import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { IUserDayDataModel } from "./user-day-data.model";
import { User } from "@modules/user/domain/user.entity";

@Index("user_day_data_user_idx", ["userId"])
@Index("user_day_data_idx", ["userId", "date"], { unique: true })
@Entity("user_day_data")
export class UserDayData extends BaseEntity implements IUserDayDataModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column({
    name: "user_id",
    type: "int",
    nullable: false,
  })
  userId: number;

  @Column({
    name: "date",
    type: "date",
    nullable: false,
  })
  date: Date;

  @Column({
    name: "ref_count",
    type: "int",
    nullable: false,
    default: 0,
  })
  refCount: number;

  @Column({
    name: "balance",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  balance: number;

  @Column({
    name: "commission",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  commission: number;

  @Column({
    name: "network_revenue",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  networkRevenue: number;

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
