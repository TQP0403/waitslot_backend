import { Injectable, Logger } from "@nestjs/common";
import { isDefined } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, Repository, SelectQueryBuilder } from "typeorm";
import { User } from "./domain/user.entity";
import { AppError, ERROR_CODE, Ranking } from "@configs/index";
import { ListModel, ValidatorHelper } from "@helpers/index";
import {
  ITotalHolderMinted,
  IUserBalance,
  IUserResponse,
} from "./interfaces/user.interface";
import {
  LeaderboardRanking,
  LeaderboardType,
} from "./interfaces/leaderboard.enum";
import { Leaderboard } from "./interfaces/leaderboard.interface";
import { CacheService } from "@modules/cache/cache.service";
import { plainToClass } from "class-transformer";
import { ObjectHelper } from "@helpers/object.helper";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly cacheService: CacheService,
  ) {}

  private _subQueryTopRanking(type: LeaderboardType): SelectQueryBuilder<any> {
    let rankQueryStr =
      "(row_number() over (ORDER BY q.ref_count DESC, q.wbxp_balance DESC))::int";
    if (type === LeaderboardType.BALANCE) {
      rankQueryStr =
        "(row_number() over (ORDER BY q.wbxp_balance DESC, q.ref_count DESC))::int";
    }

    const noRank = Ranking[LeaderboardRanking.NO_LEADER];
    const entryRank = Ranking[LeaderboardRanking.ENTRY_LEADER];
    const potentialRank = Ranking[LeaderboardRanking.POTENTAIL_LEADER];
    const futureRank = Ranking[LeaderboardRanking.FUTURE_LEADER];
    const powerRank = Ranking[LeaderboardRanking.POWER_LEADER];
    const alphaRank = Ranking[LeaderboardRanking.ALPHA_LEADER];

    const query = this.userRepo
      .createQueryBuilder("q")
      .select("q.id", "id")
      .addSelect("q.username", "username")
      .addSelect("q.fullname", "fullname")
      .addSelect("q.avatar", "avatar")
      .addSelect("q.ref_count", "refCount")
      .addSelect("q.wbxp_balance", "wbxpBalance")
      .addSelect(rankQueryStr, "rank")
      .addSelect(
        `CASE
        WHEN q.ref_count >= ${entryRank.condition} AND q.ref_count < ${potentialRank.condition} THEN '${entryRank.title}'
        WHEN q.ref_count >= ${potentialRank.condition} AND q.ref_count < ${futureRank.condition} THEN '${potentialRank.title}'
        WHEN q.ref_count >= ${futureRank.condition} AND q.ref_count < ${powerRank.condition} THEN '${futureRank.title}'
        WHEN q.ref_count >= ${powerRank.condition} AND q.ref_count < ${alphaRank.condition} THEN '${powerRank.title}'
        WHEN q.ref_count >= ${alphaRank.condition} THEN '${alphaRank.title}'
        ELSE '${noRank.title}'
        END`,
        "leaderRanking",
      )
      .addSelect("COALESCE(total_network_revenue,0)", "totalNetworkRevenue")
      .leftJoin(
        (qb) => {
          return qb
            .select("u.ref_by_id", "id")
            .addSelect("sum(u.wbxp_balance)", "total_network_revenue")
            .from("wbxp.users", "u")
            .groupBy("u.ref_by_id");
        },
        "temp",
        "temp.id = q.id",
      );

    return query;
  }

  public async getListLeaderBoard(
    type?: LeaderboardType,
    limit?: number,
  ): Promise<Leaderboard[]> {
    try {
      type = type || LeaderboardType.REFERRAL;

      const subQuery = this._subQueryTopRanking(type);

      const listQuery = subQuery.cache(30_000).limit(limit || 10);

      const result = await listQuery.getRawMany();

      return result;
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getUserPositionLeaderBoard(
    userId: number,
    type?: LeaderboardType,
  ): Promise<Leaderboard> {
    try {
      type = type || LeaderboardType.REFERRAL;

      const subQuery = this._subQueryTopRanking(type);

      const positionQuery: Leaderboard = await this.userRepo.manager
        .createQueryBuilder()
        .select("t.*")
        .from("(" + subQuery.getQuery() + ")", "t")
        .where("t.id = :userId", { userId })
        .getRawOne<Leaderboard>();

      return positionQuery;
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getListReferral(
    userId: number,
    page?: number,
    pageSize?: number,
  ) {
    try {
      const take = pageSize || 10;
      const skip = page > 0 ? (page - 1) * take : 0;

      const [list, count] = await this.userRepo
        .createQueryBuilder("q")
        .cache(60_000)
        .where("q.ref_by_id = :userId", { userId })
        .orderBy("id", "DESC")
        .take(take)
        .offset(skip)
        .getManyAndCount();

      return { rows: list, total: count };
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getListPhone(): Promise<string[]> {
    try {
      const result = await this.userRepo
        .createQueryBuilder("q")
        .cache(60_000)
        .select("phone", "phone")
        .where("phone is not null")
        .getRawMany<{ phone: string }>();

      return result.map((res) => res.phone);
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getUserByUsername(username: string): Promise<User> {
    return await this.userRepo.findOne({
      where: { username },
      cache: 60_000,
    });
  }

  public async getUserByRefName(refName: string): Promise<User> {
    return await this.userRepo.findOne({
      where: { refName },
      cache: 60_000,
    });
  }

  private async _getCacheUser(id: number): Promise<User | null> {
    const key = `user:${id.toString()}`;
    const rawData = await this.cacheService.get(key);
    if (!isDefined(rawData)) return null;
    const data: User = JSON.parse(rawData);
    let user = new User();
    ObjectHelper.deepCopyAttribute(user, data);
    return user;
  }

  private async _setCacheUser(user: User): Promise<void> {
    const key = `user:${user.id.toString()}`;
    if (isDefined(user)) {
      await this.cacheService.set(key, user, 60);
    }
  }

  public async getUserById(id: number): Promise<User> {
    let user = await this._getCacheUser(id);
    if (user === null) {
      user = await this.userRepo.findOne({
        where: { id },
        cache: 5_000,
      });

      await this._setCacheUser(user);
    }

    return user;
  }

  public async isExistUserId(id: number): Promise<boolean> {
    return await this.userRepo.exist({
      where: { id },
      cache: 60_000,
    });
  }

  public async isExistRefName(refName: string): Promise<boolean> {
    return await this.userRepo.exist({
      where: { refName },
      cache: 60_000,
    });
  }

  public async isExistUsername(username: string): Promise<boolean> {
    return await this.userRepo.exist({
      where: { username },
      cache: 60_000,
    });
  }

  public async getUserBalance(userId: number): Promise<IUserBalance> {
    return await this.userRepo
      .createQueryBuilder("q")
      .select("q.wbxp_balance", "wbxpBalance")
      .where("q.id = :userId", { userId })
      .cache(30_000)
      .getRawOne<IUserBalance>();
  }

  public async getTotalNetworkBalance(userId: number): Promise<number> {
    const result = await this.userRepo
      .createQueryBuilder("q")
      .select("COALESCE(sum(q.wbxp_balance),0)", "totalNetworkRevenue")
      .where("q.ref_by_id = :userId", { userId })
      .cache(30_000)
      .getRawOne<{ totalNetworkRevenue: number }>();
    return result.totalNetworkRevenue;
  }

  public async getTotalMinted(): Promise<ITotalHolderMinted> {
    return await this.userRepo
      .createQueryBuilder("q")
      .select("count(1)::int", "totalHolder")
      .addSelect("sum(q.wbxp_balance)", "totalMinted")
      .where("q.wbxp_balance > 0")
      .cache(30_000)
      .getRawOne<ITotalHolderMinted>();
  }

  public async checkExistRefName(refName: string): Promise<void> {
    if (!ValidatorHelper.validateUsername(refName)) {
      throw new AppError(
        ERROR_CODE.BAD_REQUEST,
        "refName not allow special character",
      );
    }

    const check = await this.isExistRefName(refName);

    if (check) {
      throw new AppError(ERROR_CODE.CONFLICT, "ref name already exist");
    }
  }

  public async checkExistUsername(username: string): Promise<void> {
    if (
      !ValidatorHelper.validateEmail(username) &&
      !ValidatorHelper.validatePhone(username)
    ) {
      throw new AppError(
        ERROR_CODE.BAD_REQUEST,
        "username must be email or phone number",
      );
    }

    const check = await this.isExistUsername(username);

    if (check) {
      throw new AppError(ERROR_CODE.CONFLICT, "username already exist");
    }
  }

  public async incCheckinCount(userId: number): Promise<void> {
    await this.userRepo.increment({ id: userId }, "checkinCount", 1);
  }

  public async incRefCount(refUser: User): Promise<void> {
    await this.userRepo.increment({ id: refUser.id }, "refCount", 1);
  }

  public async increaseUserCommission(
    userId: number,
    commissionAmount: number,
  ): Promise<void> {
    await this.userRepo.increment(
      { id: userId },
      "commissionAmount",
      commissionAmount,
    );
  }

  public async increaseUserBalance(
    userId: number,
    balance: number,
  ): Promise<void> {
    await this.userRepo.increment({ id: userId }, "wbxpBalance", balance);
  }

  public async decreaseUserBalance(
    userId: number,
    balance: number,
  ): Promise<void> {
    const user = await this.userRepo.findOne({
      where: [{ id: userId }],
      cache: 30_000,
    });

    if (!user) {
      throw new EntityNotFoundError(User, userId);
    }

    if (user.wbxpBalance < balance) {
      throw new AppError(ERROR_CODE.BAD_REQUEST, "Insufficient balance.");
    }

    await this.userRepo.decrement({ id: userId }, "wbxpBalance", balance);
  }

  public async createUser(
    refName: string,
    fullname: string,
    username: string,
    totalWaitingSlot: number,
    refId: number,
    bio?: string,
    avatar?: string,
  ): Promise<User> {
    const user = new User();
    // check param.username is email or phone
    if (ValidatorHelper.validateEmail(username)) {
      user.email = username;
      user.isKycEmail = true;
    } else if (ValidatorHelper.validatePhone(username)) {
      user.phone = username;
      user.isKycPhone = true;
    } else {
      throw new AppError(
        ERROR_CODE.BAD_REQUEST,
        "Username must be email or phone number",
      );
    }
    user.refName = refName;
    user.fullname = fullname;
    user.username = username;
    user.refById = refId;
    user.avatar = avatar;
    user.bio = bio;
    user.wbxpBalance = 0;
    user.refCount = 0;
    user.checkinCount = 0;
    user.waitingSlot = totalWaitingSlot + 1;

    await this.userRepo.save(user, { transaction: false });

    return user;
  }

  public async updateUserProfile(
    id: number,
    fullname?: string,
    avatar?: string,
    bio?: string,
  ) {
    try {
      if (isDefined(avatar) || isDefined(fullname) || isDefined(bio)) {
        await this.userRepo.update(id, { fullname, avatar, bio });
      }

      return;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getFriendMinted(
    missionIds: number[],
    userId: number,
  ): Promise<ListModel<IUserResponse>> {
    try {
      let query = this.userRepo
        .createQueryBuilder("q")
        .leftJoin(
          (qb) => {
            return qb
              .select("mission_id")
              .addSelect("user_id")
              .from("wbxp.do_missions", "dm");
          },
          "temp",
          "temp.user_id = q.id",
        )
        .andWhere("mission_id in (:...missionIds)", { missionIds })
        .andWhere("ref_by_id = :userId", { userId })
        .take(3);

      let [rows, total] = await query.getManyAndCount();

      return { rows: rows.map((res) => res.getResponse()), total };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getListUserByIds(userIds: number[]): Promise<User[]> {
    try {
      const users = await this.userRepo.find({
        where: userIds.map((id) => ({ id })),
      });
      return users;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
