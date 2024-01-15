import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IDoMissionsModel } from "./do-missions.model";
import { User } from "@modules/user/domain/user.entity";

@Entity("do_missions")
@Index(["userId", "missionId"])
@Index(["userId", "isClaimed"])
export class DoMissions extends BaseEntity implements IDoMissionsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("mission_idx")
  @Column({
    name: "mission_id",
    type: "integer",
    nullable: true,
  })
  missionId: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Index("mission_user_idx")
  @Column({
    name: "user_id",
    type: "integer",
    nullable: true,
  })
  userId: number;

  @Column({
    name: "reward_amount",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  rewardAmount: number;

  @Column({
    name: "process",
    type: "integer",
    nullable: false,
    default: 1,
  })
  process: number;

  @Index("is_claimed_idx")
  @Column({
    name: "is_claimed",
    type: "boolean",
    nullable: false,
    default: false,
  })
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
