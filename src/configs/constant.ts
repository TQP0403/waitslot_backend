import {
  LeaderRanking,
  LeaderboardRanking,
} from "@modules/user/interfaces/leaderboard.enum";
import { env } from "./environment-variable";

export const RANDOM_LENGTH = 16;

export const Ranking: Record<LeaderboardRanking, LeaderRanking> = {
  [LeaderboardRanking.NO_LEADER]: {
    logo: "",
    title: "",
    condition: 0,
    rewardAmount: 0,
  },
  [LeaderboardRanking.ENTRY_LEADER]: {
    logo: env.metadata.leaderRankingLogo1,
    title: "Entry Leader",
    condition: 10,
    rewardAmount: 50,
  },
  [LeaderboardRanking.POTENTAIL_LEADER]: {
    logo: env.metadata.leaderRankingLogo2,
    title: "Potential Leader",
    condition: 50,
    rewardAmount: 250,
  },
  [LeaderboardRanking.FUTURE_LEADER]: {
    logo: env.metadata.leaderRankingLogo3,
    title: "Future Leader",
    condition: 100,
    rewardAmount: 500,
  },
  [LeaderboardRanking.POWER_LEADER]: {
    logo: env.metadata.leaderRankingLogo4,
    title: "Power Leader",
    condition: 200,
    rewardAmount: 1000,
  },
  [LeaderboardRanking.ALPHA_LEADER]: {
    logo: env.metadata.leaderRankingLogo5,
    title: "Alpha Leader",
    condition: 500,
    rewardAmount: 5000,
  },
};

export const DEFAULT_BIO =
  "You're on the way to becoming an intelligence investor";
