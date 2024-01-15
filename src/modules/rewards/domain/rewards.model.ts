import { IUserModel } from "@modules/user/domain/user.model";

export interface IRewardsModel {
  readonly id: number;

  readonly description: string;

  readonly user: IUserModel;
  readonly userId: number;

  readonly fromId: number; // user id
  readonly rewardAmount: number;
  readonly isClaimed: boolean;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
