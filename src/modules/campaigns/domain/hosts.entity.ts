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
import { IHostsModel } from "./hosts.model";
import { Campaigns } from "@modules/campaigns/domain/campaigns.entity";
import { HostTypeEnum } from "../interfaces/host.enum";

@Entity("hosts")
export class Hosts extends BaseEntity implements IHostsModel {
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
    name: "display_name",
    type: "varchar",
    nullable: false,
    default: "",
  })
  displayName: string;

  @Column({
    name: "avatar",
    type: "varchar",
    nullable: true,
  })
  avatar: string;

  @Column({
    name: "description",
    type: "varchar",
    nullable: true,
    default: false,
  })
  description: string;

  @Column({
    name: "type",
    type: "int2",
    nullable: false,
    default: 0,
  })
  type: HostTypeEnum;

  @Column({
    name: "priority",
    type: "int2",
    nullable: false,
    default: 5,
  })
  priority: number;

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
