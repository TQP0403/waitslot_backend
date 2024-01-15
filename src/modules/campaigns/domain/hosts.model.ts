import { ICampaignsModel } from "@modules/campaigns/domain/campaigns.model";
import { HostTypeEnum } from "../interfaces/host.enum";

export interface IHostsModel {
  readonly id: number;

  readonly campaignId: number;
  readonly campaign: ICampaignsModel;

  readonly displayName: string;
  readonly avatar: string;
  readonly description: string;

  readonly type: HostTypeEnum;
  readonly priority: number;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
