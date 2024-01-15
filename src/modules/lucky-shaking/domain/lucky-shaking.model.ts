import { IUserModel } from "@modules/user/domain/user.model";

export interface ILuckyShakingModel {
  readonly id: number;

  readonly toId: number;
  readonly to: IUserModel;

  readonly fromId: number; // user id
  readonly from: IUserModel;

  readonly amount: number;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
