export interface IVerificationsModel {
  readonly id: number;
  readonly token: string;
  readonly expireTime: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
