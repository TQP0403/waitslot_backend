import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ILuckyBoxModel } from "./lucky-boxes.model";

@Entity("lucky_boxes")
export class LuckyBox extends BaseEntity implements ILuckyBoxModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "name",
    type: "varchar",
    nullable: false,
  })
  name: string;

  @Column({
    name: "type",
    type: "int2",
    nullable: false,
    default: 0,
  })
  type: number;

  @Column({
    name: "wbxp_amount",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  wbxpAmount: number;

  @Column({
    name: "limit",
    type: "integer",
    nullable: true,
  })
  limit: number;

  @Column({
    name: "image",
    type: "varchar",
    nullable: true,
  })
  image: string;

  @Column({
    name: "description",
    type: "varchar",
    nullable: true,
  })
  description: string;

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
