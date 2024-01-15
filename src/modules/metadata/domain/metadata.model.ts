export interface IMetadataModel {
  readonly id: number;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  readonly totalWaitingSlot: number;
  readonly luckyShakingReward: number;
}
