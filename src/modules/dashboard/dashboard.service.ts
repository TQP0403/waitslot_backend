import { AppError } from "@configs/app-error";
import { ERROR_CODE } from "@configs/codes";
import { UserService } from "@modules/user/user.service";
import { Injectable, Logger } from "@nestjs/common";
import { env } from "@configs/environment-variable";
import { RewardsService } from "@modules/rewards/rewards.service";
import { DayDataService } from "@modules/day-data/day-data.service";

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  private readonly topBanner = env.metadata.topBanner;
  private readonly deepLink = env.metadata.deepLink;

  constructor(
    private readonly userService: UserService,
    private readonly dayDataService: DayDataService,
    private readonly rewardsService: RewardsService,
  ) {}

  public async getTopBanner() {
    return {
      topBanner: this.topBanner,
      deepLink: this.deepLink,
    };
  }

  public async getDashboard() {
    try {
      return this.dayDataService.getDayData();
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getUserProfileDashboard(userId: number): Promise<any> {
    try {
      const [position, user, totalNetworkBalance, totalCommissionReward] =
        await Promise.all([
          this.userService.getUserPositionLeaderBoard(userId),
          this.userService.getUserById(userId),
          this.userService.getTotalNetworkBalance(userId),
          this.rewardsService.getReward(userId),
        ]);

      return {
        rank: position.rank,
        refCount: user.refCount,
        totalNetworkBalance,
        totalCommissionReward: totalCommissionReward.totalReward,
      };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
