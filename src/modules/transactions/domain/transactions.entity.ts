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
import { ITransactionsModel } from "./transactions.model";
import { User } from "@modules/user/domain/user.entity";
import { TransactionsType } from "../interfaces/transactions.enum";
import { Cards } from "@modules/cards/domain/cards.entity";

@Entity("transactions")
export class Transactions extends BaseEntity implements ITransactionsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "from_id", referencedColumnName: "id" })
  from: User;

  @Column({
    name: "from_id",
    type: "int",
    nullable: true,
  })
  fromId: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "to_id", referencedColumnName: "id" })
  to: User;

  @Column({
    name: "to_id",
    type: "integer",
    nullable: false,
  })
  toId: number;

  @ManyToOne((type) => Cards, { onDelete: "SET NULL" })
  @JoinColumn({ name: "card_id", referencedColumnName: "id" })
  card: Cards;

  @Column({
    name: "card_id",
    type: "integer",
    nullable: true,
  })
  cardId: number;

  @Column({
    name: "type",
    type: "int2",
    nullable: false,
    default: TransactionsType.TRANSFER,
  })
  type: TransactionsType;

  @Column({
    name: "amount",
    type: "double precision",
    nullable: false,
    default: 0,
  })
  amount: number;

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
