import { IUserModel } from "@modules/user/domain/user.model";

export interface IDoMissionsModel {
  readonly id: number;

  readonly missionId: number;

  readonly user: IUserModel;
  readonly userId: number;

  readonly rewardAmount: number;

  readonly isClaimed: boolean;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
