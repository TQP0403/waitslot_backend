export interface IUserDayDataResponse {
  currentData: number;
  incData: number;
  incPercentage: number;
  rows: IUserDayDataRecord[];
}

export interface IUserDayDataRecord {
  date: Date;
  data: number;
}

export interface IUserTopRankResponse {
  id: number;
  fullname: string;
  avatar: string;
  refById: number;
  rank: number;
  userId: number;
  balance: number;
  refCount: number;
  networkRevenue: number;
  commission: number;
  newData: number;
  oldData: number;
  incData: number;
  incPercentage: number;
}
