import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "@modules/user/domain/user.entity";
import { ILuckyShakingModel } from "./lucky-shaking.model";

@Entity("lucky_shaking")
export class LuckyShaking extends BaseEntity implements ILuckyShakingModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "from_id", referencedColumnName: "id" })
  from: User;

  @Column({
    name: "from_id",
    type: "int",
    nullable: true,
  })
  fromId: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "to_id", referencedColumnName: "id" })
  to: User;

  @Column({
    name: "to_id",
    type: "integer",
    nullable: false,
  })
  toId: number;

  @Column({
    name: "amount",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  amount: number;

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
