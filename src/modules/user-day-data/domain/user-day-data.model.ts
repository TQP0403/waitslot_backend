import { IUserModel } from "@modules/user/domain/user.model";

export interface IUserDayDataModel {
  readonly id: number;

  readonly user: IUserModel;

  readonly userId: number;
  readonly date: Date;

  readonly refCount: number;
  readonly balance: number;
  readonly commission: number;
  readonly networkRevenue: number;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
