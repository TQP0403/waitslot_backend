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
import { ICardsModel } from "./cards.model";

@Entity("cards")
export class Cards extends BaseEntity implements ICardsModel {
  @PrimaryGeneratedColumn()
  id: number;

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
