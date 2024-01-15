import { ICampaignsModel } from "@modules/campaigns/domain/campaigns.model";
import { IUserModel } from "@modules/user/domain/user.model";

export interface ITicketsModel {
  readonly id: number;

  readonly userId: number;
  readonly user: IUserModel;

  readonly campaignId: number;
  readonly campaign: ICampaignsModel;

  readonly price: number;
  readonly isUsed: boolean;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
