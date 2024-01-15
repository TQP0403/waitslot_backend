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
import { ITicketsModel } from "./tickets.model";
import { User } from "@modules/user/domain/user.entity";
import { Campaigns } from "@modules/campaigns/domain/campaigns.entity";

@Entity("tickets")
export class Tickets extends BaseEntity implements ITicketsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "user_id",
    type: "int",
    nullable: false,
  })
  userId: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

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
    name: "price",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  price: number;

  @Column({
    name: "is_used",
    type: "boolean",
    nullable: false,
    default: false,
  })
  isUsed: boolean;

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
