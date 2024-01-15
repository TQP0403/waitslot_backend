import { ICampaignsModel } from "@modules/campaigns/domain/campaigns.model";
import { MissionsType } from "../missions.enum";

export interface IMissionsModel {
  readonly id: number;

  readonly campaign: ICampaignsModel;
  readonly campaignId: number;

  readonly logo: string;
  readonly title: string;

  readonly type: MissionsType;

  readonly rule: number;

  readonly rewardAmount: number;
  readonly description: string;

  readonly link: string;
  readonly enable: boolean;
  readonly startTime: Date;
  readonly endTime: Date;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
