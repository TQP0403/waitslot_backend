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
import { IMissionsModel } from "./missions.model";
import { Campaigns } from "@modules/campaigns/domain/campaigns.entity";
import { MissionsType } from "../missions.enum";

@Entity("missions")
export class Missions extends BaseEntity implements IMissionsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Campaigns)
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Campaigns;

  @Column({
    name: "campaign_id",
    type: "int",
    nullable: true,
  })
  campaignId: number;

  @Column({
    name: "title",
    type: "varchar",
    nullable: false,
  })
  title: string;

  @Index("mission_type_idx")
  @Column({
    name: "type",
    type: "int2",
    nullable: false,
  })
  type: MissionsType;

  @Column({
    name: "rule",
    type: "int",
    nullable: true,
  })
  rule: number;

  @Column({
    name: "reward_amount",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  rewardAmount: number;

  @Column({
    name: "description",
    type: "varchar",
    nullable: true,
  })
  description: string;

  @Column({
    name: "link",
    type: "varchar",
    nullable: true,
  })
  link: string;

  @Column({
    name: "logo",
    type: "varchar",
    nullable: true,
  })
  logo: string;

  @Column({
    name: "enable",
    type: "boolean",
    nullable: false,
    default: true,
  })
  enable: boolean;

  @Column({
    name: "start_time",
    type: "timestamp with time zone",
    nullable: true,
  })
  startTime: Date;

  @Index("mission_endtime_idx")
  @Column({
    name: "end_time",
    type: "timestamp with time zone",
    nullable: true,
  })
  endTime: Date;

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
