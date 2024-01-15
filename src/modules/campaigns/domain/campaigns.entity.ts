import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { ICampaignsModel } from "./campaigns.model";
import { Hosts } from "./hosts.entity";

@Entity("campaigns")
export class Campaigns extends BaseEntity implements ICampaignsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "title",
    type: "varchar",
    nullable: false,
    default: "",
  })
  title: string;

  @Column({
    name: "description",
    type: "varchar",
    nullable: false,
    default: "",
  })
  description: string;

  @Column({
    name: "banner",
    type: "varchar",
    nullable: false,
    default: "",
  })
  banner: string;

  @Column({
    name: "content",
    type: "varchar",
    nullable: false,
    default: "",
  })
  content: string;

  @Column({
    name: "priority",
    type: "int2",
    nullable: false,
    default: 5,
  })
  priority: number;

  @Column({
    name: "location_name",
    type: "varchar",
    nullable: true,
  })
  locationName: string;

  @Column({
    name: "location_address",
    type: "varchar",
    nullable: true,
  })
  locationAddress: string;

  @OneToMany(() => Hosts, (record) => record.campaign)
  hosts: Hosts[];

  @Column({
    name: "start_time",
    type: "timestamp with time zone",
    nullable: true,
  })
  startTime: Date;

  @Column({
    name: "end_time",
    type: "timestamp with time zone",
    nullable: true,
  })
  endTime: Date;

  @Column({
    name: "published_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  publishedAt?: Date;

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
