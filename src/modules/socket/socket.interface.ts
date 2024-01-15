export type ISocketPayload<T> = {
  data: T;
  arg?: any;
};

export type JoinRoom = {
  userId: number;
  roomId: number;
  section: number;
  startTime: number;
  endTime: number;
  members: number[];
};
