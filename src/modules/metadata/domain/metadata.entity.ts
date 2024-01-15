import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IMetadataModel } from "./metadata.model";

@Entity("metadata")
export class Metadata extends BaseEntity implements IMetadataModel {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({
    name: "total_waiting_slot",
    type: "integer",
    nullable: false,
    default: 0,
  })
  totalWaitingSlot: number;

  @Column({
    name: "lucky_shaking_reward",
    type: "integer",
    nullable: false,
    default: 0,
  })
  luckyShakingReward: number;
}
