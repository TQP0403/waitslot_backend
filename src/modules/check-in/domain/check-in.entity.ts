import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ICheckinModel } from "./check-in.model";
import { User } from "@modules/user/domain/user.entity";

@Entity("check_ins")
export class Checkin extends BaseEntity implements ICheckinModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: "check_in_date",
    type: "timestamp with time zone",
  })
  checkInDate: Date;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column({
    name: "user_id",
    type: "integer",
    nullable: false,
  })
  userId: number;
}
