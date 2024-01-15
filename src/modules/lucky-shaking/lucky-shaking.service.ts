import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { LuckyShaking } from "./domain/lucky-shaking.entity";
import { IUserResponse } from "@modules/user/interfaces/user.interface";
import { ListModel } from "@helpers/dto.helper";
import { AppError, ERROR_CODE } from "@configs/index";
import { UserService } from "@modules/user/user.service";
import { MetadataService } from "@modules/metadata/metadata.service";
import { IUserShaking } from "./interfaces/lucky-shaking.interface";
import { MissionsService } from "@modules/missions/missions.service";

@Injectable()
export class LuckyShakingService {
  private readonly logger: Logger = new Logger(LuckyShakingService.name);

  constructor(
    @InjectRepository(LuckyShaking)
    private readonly repo: Repository<LuckyShaking>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly missionsService: MissionsService,
    private readonly metadataService: MetadataService,
  ) {}

  public async isMinted(userId: number, toUserId: number): Promise<boolean> {
    try {
      const check = await this.userService.isExistUserId(toUserId);
      if (!check) throw new AppError(ERROR_CODE.BAD_REQUEST, "user not found");

      return this.repo.exist({ where: { fromId: userId, toId: toUserId } });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getMint(
    userId: number,
    toUserId: number,
  ): Promise<LuckyShaking> {
    try {
      return this.repo.findOne({ where: { fromId: userId, toId: toUserId } });
    } catch (error) {
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async mint(userId: number, toUserId: number): Promise<void> {
    const check = await this.isMinted(userId, toUserId);
    if (check) throw new AppError(ERROR_CODE.CONFLICT, "minted");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");

    try {
      const meta = await this.metadataService.get(30_000);

      if (meta.luckyShakingReward === 0) return;

      // mint fixed amount
      const mint = new LuckyShaking();
      mint.fromId = userId;
      mint.toId = toUserId;
      mint.amount = meta.luckyShakingReward;
      await this.repo.save(mint);

      await this.userService.increaseUserBalance(toUserId, mint.amount);

      await this.missionsService.doMissionSendLuckyBox(userId);

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  public async getListUserShaking(
    userIds: number[],
  ): Promise<ListModel<IUserShaking>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");

    try {
      const meta = await this.metadataService.get(30_000);
      const users = await this.userService.getListUserByIds(userIds);

      await queryRunner.commitTransaction();

      const userShakingList: IUserShaking[] = [];

      for (const user of users) {
        const userShaking: IUserShaking = {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          avatar: user.avatar,
          amount: meta.luckyShakingReward,
        };

        userShakingList.push(userShaking);
      }

      return {
        total: userShakingList.length,
        rows: userShakingList,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
