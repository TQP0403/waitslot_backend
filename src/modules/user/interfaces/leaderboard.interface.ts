export interface Leaderboard {
  rank: number;
  id: number;
  username: string;
  fullname?: string;
  avatar?: string;
  refCount: number;
  wbxpBalance: number;
  leadboardRanking: string;
}

export interface LeaderboardResponse {
  position: Leaderboard;
  rows: Leaderboard[];
}
