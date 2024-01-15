export interface IUserModel {
  readonly id: number;

  readonly username: string;
  readonly email: string;
  readonly phone: string;

  readonly bio: string;

  readonly avatar: string;
  readonly fullname: string;

  readonly commissionAmount: number;
  readonly wbxpBalance: number;
  readonly waitingSlot: number;

  readonly refName: string;
  readonly refCount: number;
  readonly refById: number;

  readonly isKycEmail: boolean;
  readonly isKycPhone: boolean;

  readonly enable: boolean;

  readonly checkinCount: number;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
