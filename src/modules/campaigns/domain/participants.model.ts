import { ICampaignsModel } from "@modules/campaigns/domain/campaigns.model";
import { IUserModel } from "@modules/user/domain/user.model";

export interface IParticipantsModel {
  readonly id: number;

  readonly campaignId: number;
  readonly campaign: ICampaignsModel;

  readonly userId: number;
  readonly user: IUserModel;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
