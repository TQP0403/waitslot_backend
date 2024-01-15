export interface IDayDataModel {
  readonly id: number;

  readonly date: Date;

  readonly totalBalance: number;
  readonly totalHolder: number;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
