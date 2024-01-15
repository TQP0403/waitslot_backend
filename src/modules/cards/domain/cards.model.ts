export interface ICardsModel {
  readonly id: number;

  readonly image: string;

  readonly description: string;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
