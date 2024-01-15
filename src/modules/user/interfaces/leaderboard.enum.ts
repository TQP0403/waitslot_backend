export enum LeaderboardType {
  REFERRAL,
  BALANCE,
}

export enum LeaderboardRanking {
  NO_LEADER,
  ENTRY_LEADER,
  POTENTAIL_LEADER,
  FUTURE_LEADER,
  POWER_LEADER,
  ALPHA_LEADER,
}

export interface LeaderRanking {
  logo: string;
  title: string;
  condition: number;
  rewardAmount: number;
}

export interface UserLeaderRanking extends LeaderRanking {
  isComplete: boolean;
}
