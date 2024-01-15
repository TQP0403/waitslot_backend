import { AppError, ERROR_CODE, Ranking } from "@configs/index";
import {
  LeaderboardType,
  UserLeaderRanking,
} from "@modules/user/interfaces/leaderboard.enum";
import { UserService } from "@modules/user/user.service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(private readonly userService: UserService) {}

  public async getUserPosition(
    userId: number,
    type?: LeaderboardType,
    pageSize?: number,
  ) {
    try {
      type = type || LeaderboardType.REFERRAL;

      const list = await this.userService.getListLeaderBoard(type, pageSize);
      const record = await this.userService.getUserPositionLeaderBoard(
        userId,
        type,
      );

      return { rows: list, position: record };
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getUserLeaderRanking(
    userId: number,
  ): Promise<UserLeaderRanking[]> {
    let results: UserLeaderRanking[] = [];

    const user = await this.userService.getUserById(userId);

    for (let i = 1; i <= 5; i++) {
      const rank: UserLeaderRanking = Ranking[i];
      rank.isComplete = false;
      if (user.refCount >= rank.condition) {
        rank.isComplete = true;
      }
      results.push(rank);
    }

    return results;
  }
}
