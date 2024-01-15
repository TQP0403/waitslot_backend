import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IDayDataModel } from "./day-data.model";

@Entity("day_data")
export class DayData extends BaseEntity implements IDayDataModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("date_day_data_idx", { unique: true })
  @Column({
    name: "date",
    type: "date",
    nullable: false,
    unique: true,
  })
  date: Date;

  @Column({
    name: "total_balance",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  totalBalance: number;

  @Column({
    name: "total_holder",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  totalHolder: number;

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
