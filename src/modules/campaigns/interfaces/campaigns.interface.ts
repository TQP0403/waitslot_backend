import { ListModel } from "@helpers/index";
import { ICampaignsModel } from "../domain/campaigns.model";
import { IUserResponse } from "@modules/user/interfaces/user.interface";

export interface ICampaignAddition {
  readonly rewardAmount: number;
  readonly totalMintedReward: number;
  readonly countTotalMinted: number;
  readonly networks: ListModel<IUserResponse>;
}

export interface ICampaignDetail extends ICampaignAddition, ICampaignsModel {}
