export interface IUserResponse {
  id: number;

  username: string;
  email?: string;
  phone?: string;

  fullname?: string;
  avatar?: string;
  bio?: string;

  wbxpBalance: number;
  waitingSlot: number;
  totalWaitingSlot: number;

  refName: string;
  refCount: number;

  checkinCount: number;
}

export interface IUserBalance {
  wbxpBalance: number;
}

export interface ITotalHolderMinted {
  totalMinted: number;
  totalHolder: number;
}
