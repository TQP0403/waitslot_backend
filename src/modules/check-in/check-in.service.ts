import { Injectable, Logger } from "@nestjs/common";
import { Checkin } from "./domain/check-in.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { AppError, ERROR_CODE } from "../../configs";
import { isDefined } from "class-validator";
import { MissionsService } from "@modules/missions/missions.service";
import { UserService } from "@modules/user/user.service";

@Injectable()
export class CheckInService {
  private readonly logger = new Logger(CheckInService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Checkin)
    private readonly checkinRepo: Repository<Checkin>,
    private readonly missionsService: MissionsService,
    private readonly userService: UserService,
  ) {}

  public async getLastCheckIn(userId: number): Promise<Checkin | null> {
    try {
      return await this.checkinRepo
        .createQueryBuilder("q")
        .where("q.user_id = :userId", { userId })
        .cache(30_000)
        .andWhere("date(q.check_in_date) = date(now())")
        .getOne();
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async checkIn(userId: number) {
    const isCheckin = await this.getLastCheckIn(userId);
    if (isDefined(isCheckin)) {
      throw new AppError(ERROR_CODE.BAD_REQUEST, "user already check-in");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");

    try {
      const checkIn = new Checkin();
      checkIn.userId = userId;
      await this.checkinRepo.save(checkIn, { transaction: false });

      await this.userService.incCheckinCount(userId);
      await this.missionsService.doMissionDaily(userId);

      await queryRunner.commitTransaction();
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  public async getCheckInList(userId: number): Promise<Checkin[]> {
    try {
      const [checkins, count] = await this.checkinRepo
        .createQueryBuilder("q")
        .where("q.user_id = :userId", { userId })
        .cache(60_000)
        .getManyAndCount();

      return checkins;
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
