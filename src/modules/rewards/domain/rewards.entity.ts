import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { IRewardsModel } from "./rewards.model";
import { User } from "@modules/user/domain/user.entity";

@Entity("rewards")
export class Rewards extends BaseEntity implements IRewardsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "description",
    type: "varchar",
    nullable: false,
    default: "",
  })
  description: string;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column({
    name: "user_id",
    type: "integer",
    nullable: false,
  })
  userId: number;

  @Column({
    name: "from_id",
    type: "integer",
    nullable: true,
  })
  fromId: number;

  @Column({
    name: "reward_amount",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  rewardAmount: number;

  @Column({
    name: "is_claimed",
    type: "boolean",
    nullable: false,
    default: false,
  })
  @Index()
  isClaimed: boolean;

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
