export interface ILuckyBoxModel {
  readonly id: number;

  readonly name: string;

  readonly type: number;
  readonly wbxpAmount: number;

  readonly limit: number;

  readonly image: string;
  readonly description: string;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
