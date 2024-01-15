import { IHostsModel } from "./hosts.model";

export interface ICampaignsModel {
  readonly id: number;

  readonly title: string;
  readonly banner: string;
  readonly description: string;

  readonly content: string;

  readonly priority: number;

  readonly startTime: Date;
  readonly endTime: Date;

  readonly locationName: string;
  readonly locationAddress: string;

  readonly hosts: IHostsModel[];

  readonly publishedAt?: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
