import { IUserModel } from "@modules/user/domain/user.model";
import { TransactionsType } from "../interfaces/transactions.enum";
import { ICardsModel } from "@modules/cards/domain/cards.model";

export interface ITransactionsModel {
  readonly id: number;

  readonly toId: number;
  readonly to: IUserModel;

  readonly fromId: number; // user id
  readonly from: IUserModel;

  readonly cardId: number;
  readonly card: ICardsModel;

  readonly type: TransactionsType;

  readonly amount: number;

  readonly description: string;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
