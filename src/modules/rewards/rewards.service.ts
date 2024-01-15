import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { Rewards } from "./domain/rewards.entity";
import { AppError, ERROR_CODE } from "@configs/index";
import { UserService } from "@modules/user/user.service";

@Injectable()
export class RewardsService {
  private readonly logger: Logger = new Logger(RewardsService.name);

  constructor(
    @InjectRepository(Rewards)
    private readonly repo: Repository<Rewards>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}

  public async getReward(
    userId: number,
  ): Promise<{ ids: number[]; totalReward: number }> {
    try {
      const result = await this.repo
        .createQueryBuilder("q")
        .select("COALESCE(sum(q.reward_amount),0)", "totalReward")
        .addSelect("COALESCE(array_agg(q.id),'{}')", "ids")
        .where("q.user_id = :userId", { userId })
        .andWhere("q.is_claimed = :isClaimed", { isClaimed: true })
        .getRawOne<{ ids: number[]; totalReward: number }>();

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getPendingReward(
    userId: number,
  ): Promise<{ ids: number[]; totalReward: number }> {
    try {
      const result = await this.repo
        .createQueryBuilder("q")
        .select("COALESCE(sum(q.reward_amount),0)", "totalReward")
        .addSelect("COALESCE(array_agg(q.id),'{}')", "ids")
        .where("q.user_id = :userId", { userId })
        .andWhere("q.is_claimed = :isClaimed", { isClaimed: false })
        .getRawOne<{ ids: number[]; totalReward: number }>();

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async mintReward(
    userId: number,
    fromId: number,
    rewardAmount: number,
    description?: string,
  ) {
    try {
      const reward = new Rewards();
      reward.description = description;
      reward.userId = userId;
      reward.rewardAmount = rewardAmount;
      reward.fromId = fromId;
      reward.isClaimed = false;

      await this.repo.save(reward);

      return;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async claimAll(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");

    try {
      const { ids, totalReward } = await this.getPendingReward(userId);

      if (totalReward > 0) {
        // const user = await this.userService.getUserById(userId);

        // set isClaimed = true
        await this.repo.update({ id: In(ids) }, { isClaimed: true });

        // update user balance
        await this.userService.increaseUserBalance(userId, totalReward);
      }
      await queryRunner.commitTransaction();

      return totalReward;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
