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
import { Campaigns } from "@modules/campaigns/domain/campaigns.entity";
import { IParticipantsModel } from "./participants.model";
import { User } from "@modules/user/domain/user.entity";

@Entity("participants")
export class Participants extends BaseEntity implements IParticipantsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "campaign_id",
    type: "int",
    nullable: false,
  })
  campaignId: number;

  @ManyToOne((type) => Campaigns, { onDelete: "CASCADE" })
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Campaigns;

  @Column({
    name: "user_id",
    type: "int",
    nullable: false,
  })
  userId: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

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
