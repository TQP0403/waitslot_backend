import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import {
  DataSource,
  EntityNotFoundError,
  In,
  IsNull,
  MoreThanOrEqual,
  Not,
  Repository,
} from "typeorm";
import { Missions } from "./domain/missions.entity";
import { Injectable, Logger } from "@nestjs/common";
import { MissionType, MissionsType } from "./missions.enum";
import { AppError, ERROR_CODE, env } from "@configs/index";
import { DoMissions } from "./domain/do-missions.entity";
import { isDefined } from "class-validator";
import { UserService } from "@modules/user/user.service";
import { ListModel } from "@helpers/dto.helper";
import { RewardsService } from "@modules/rewards/rewards.service";
import { IUserResponse } from "@modules/user/interfaces/user.interface";
import { ICampaignAddition } from "@modules/campaigns/interfaces/campaigns.interface";
import { CacheService } from "@modules/cache/cache.service";
import { plainToClass } from "class-transformer";

@Injectable()
export class MissionsService {
  private readonly commissionPercentage = env.metadata.commissionPercentage;
  private readonly logger = new Logger(MissionsService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Missions)
    private readonly repoMission: Repository<Missions>,
    @InjectRepository(DoMissions)
    private readonly repoDoMission: Repository<DoMissions>,
    private readonly userService: UserService,
    private readonly rewardsService: RewardsService,
    private readonly cacheService: CacheService,
  ) {}

  public async createDefaultMissions() {
    try {
      const missionJoinWaitlist = new Missions();
      missionJoinWaitlist.rewardAmount = 100;
      missionJoinWaitlist.title = "Join Waitlist";
      missionJoinWaitlist.rule = 1; // only 1 times
      missionJoinWaitlist.type = MissionsType.JOIN_WAITLIST;

      const missionJoinFirstShare = new Missions();
      missionJoinFirstShare.rewardAmount = 100;
      missionJoinFirstShare.title = "First Share";
      missionJoinFirstShare.rule = 1; // only 1 times
      missionJoinFirstShare.type = MissionsType.FIRST_SHARE;

      const missionDailyCheckin = new Missions();
      missionDailyCheckin.rewardAmount = 0.5;
      missionDailyCheckin.title = "Daily Checkin";
      missionDailyCheckin.type = MissionsType.DAILY_CHECKIN;

      const missionWeeklyCheckin = new Missions();
      missionWeeklyCheckin.rewardAmount = 2;
      missionWeeklyCheckin.title = "Weekly Checkin";
      missionWeeklyCheckin.type = MissionsType.WEEKLY_CHECKIN;

      const missionReferral = new Missions();
      missionReferral.rewardAmount = 5;
      missionReferral.title = "Referral";
      missionReferral.type = MissionsType.REFERRAL;

      await this.repoMission.insert([
        missionJoinWaitlist,
        missionJoinFirstShare,
        missionDailyCheckin,
        missionWeeklyCheckin,
        missionReferral,
      ]);

      return;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _getCacheMission(
    missionType: MissionType,
  ): Promise<Missions | null> {
    const key = `mission:${missionType}`;
    const rawData = await this.cacheService.get(key);
    if (!isDefined(rawData)) return null;

    return plainToClass(Missions, rawData);
  }

  private async _setCacheMission(
    missionType: MissionType,
    mission: Missions,
  ): Promise<void> {
    const key = `mission:${missionType}`;
    if (isDefined(mission)) {
      await this.cacheService.set(key, mission);
    }
  }

  public async getMissionFirstShare() {
    try {
      let mission = await this._getCacheMission("FIRST_SHARE");
      if (mission === null) {
        const now = new Date();
        mission = await this.repoMission.findOne({
          where: [
            { type: MissionsType.FIRST_SHARE, endTime: IsNull() },
            { type: MissionsType.FIRST_SHARE, endTime: MoreThanOrEqual(now) },
          ],
        });
        await this._setCacheMission("FIRST_SHARE", mission);
      }

      return mission;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getMissionJoinWaitlist() {
    try {
      let mission = await this._getCacheMission("JOIN_WAITLIST");
      if (mission === null) {
        const now = new Date();
        mission = await this.repoMission.findOne({
          where: [
            { type: MissionsType.JOIN_WAITLIST, endTime: IsNull() },
            { type: MissionsType.JOIN_WAITLIST, endTime: MoreThanOrEqual(now) },
          ],
        });
        await this._setCacheMission("JOIN_WAITLIST", mission);
      }

      return mission;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getMissionReferral() {
    try {
      const now = new Date();

      const mission = await this.repoMission.findOne({
        where: [
          { type: MissionsType.REFERRAL, endTime: IsNull() },
          { type: MissionsType.REFERRAL, endTime: MoreThanOrEqual(now) },
        ],
      });

      return mission;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getMissionMintTicket() {
    try {
      const now = new Date();

      const mission = await this.repoMission.findOne({
        where: [
          { type: MissionsType.MINT_TICKET, endTime: IsNull() },
          { type: MissionsType.MINT_TICKET, endTime: MoreThanOrEqual(now) },
        ],
      });

      return mission;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getMissionShaking() {
    try {
      const now = new Date();

      const mission = await this.repoMission.findOne({
        where: [
          { type: MissionsType.SHAKING, endTime: IsNull() },
          { type: MissionsType.SHAKING, endTime: MoreThanOrEqual(now) },
        ],
      });

      return mission;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getMissionSendLuckBox() {
    try {
      const now = new Date();

      const mission = await this.repoMission.findOne({
        where: [
          { type: MissionsType.SEND_LUCKY_BOX, endTime: IsNull() },
          { type: MissionsType.SEND_LUCKY_BOX, endTime: MoreThanOrEqual(now) },
        ],
      });

      return mission;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getMissionDaily() {
    try {
      const missions = await this.repoMission.find({
        where: {
          type: In([MissionsType.DAILY_CHECKIN]),
        },
      });

      return missions;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getCampaignAdditionDetail(
    campaignId: number,
    userId: number,
  ): Promise<ICampaignAddition> {
    try {
      const missions = await this._getAllMissionsByCampaign(campaignId);

      let rewardAmount = 0;
      for (let i = 0; i < missions.length; i++) {
        rewardAmount += missions[i].rewardAmount;
      }

      const [totalMintedReward, { countTotalMinted, networks }] =
        await Promise.all([
          this._getMissionsReward(missions),
          this._getCountUserMinted(missions, userId),
        ]);

      return { rewardAmount, totalMintedReward, countTotalMinted, networks };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _getAllMissionsByCampaign(
    campaignId: number,
  ): Promise<Missions[]> {
    try {
      let missionsQ = this.repoMission
        .createQueryBuilder("q")
        .where("campaign_id = :campaignId", { campaignId })
        .andWhere("enable = true");

      return missionsQ.getMany();
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _getCountUserMinted(
    missions: Missions[],
    userId: number,
  ): Promise<{
    countTotalMinted: number;
    networks: ListModel<IUserResponse>;
  }> {
    try {
      let networks: ListModel<IUserResponse> = {
        total: 0,
        rows: [],
      };
      let countTotalMinted = 0;

      if (missions.length === 0) return { countTotalMinted, networks };
      const missionIds = missions.map((mission) => mission.id);

      networks = await this.userService.getFriendMinted(missionIds, userId);

      let query = this.repoDoMission
        .createQueryBuilder("q")
        .select("count(distinct user_id)::int")
        .andWhere("mission_id in (:...missionIds)", { missionIds });
      const rawData = await query.getRawOne<{ count: number }>();

      return { countTotalMinted: rawData.count, networks };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _getMissionsReward(
    missions: Missions[],
    userId?: number,
  ): Promise<number> {
    const missionIds: number[] = missions.map((mission) => mission.id);
    let totalReward = 0;

    if (missions.length === 0) {
      return totalReward;
    }

    const query = this.repoDoMission
      .createQueryBuilder("q")
      .select("COALESCE(sum(reward_amount),0)", "totalReward")
      .andWhere("mission_id in (:...missionIds)", { missionIds });

    if (isDefined(userId)) {
      query.andWhere("user_id = :userId", { userId });
    }

    const data = await query.getRawOne<{ totalReward: number }>();
    totalReward = data.totalReward;

    return totalReward;
  }

  private async _getDailyMissionsByCampaign(
    campaignId: number,
    userId?: number,
  ): Promise<Missions[]> {
    try {
      const unlimited = [
        MissionsType.REFERRAL,
        MissionsType.SHAKING,
        MissionsType.SEND_LUCKY_BOX,
      ];

      let missions = await this.repoMission
        .createQueryBuilder("q")
        .select("*")
        .leftJoin(
          (qb) => {
            return qb
              .select("is_claimed", "is_minted")
              .addSelect("mission_id")
              .from("wbxp.do_missions", "do_missions")
              .where("user_id = :userId", { userId })
              .andWhere("date(created_at) = CURRENT_DATE");
          },
          "do_mission",
          "do_mission.mission_id = q.id",
        )
        .andWhere("rule is null")
        .andWhere("type not in(:...unlimited)", { unlimited })
        .andWhere("campaign_id = :campaignId", { campaignId })
        .andWhere("enable = true")
        .getRawMany();

      missions = missions.map((mission) => {
        delete mission.mission_id;
        mission.is_minted = isDefined(mission.is_minted);
        return mission;
      });

      return missions;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _getLimitedMissionsByCampaign(
    campaignId: number,
    userId?: number,
  ): Promise<Missions[]> {
    try {
      const unlimited = [
        MissionsType.REFERRAL,
        MissionsType.SHAKING,
        MissionsType.SEND_LUCKY_BOX,
      ];

      let missions = await this.repoMission
        .createQueryBuilder("q")
        .select("*")
        .leftJoin(
          (qb) => {
            return qb
              .select("is_claimed", "is_minted")
              .addSelect("mission_id")
              .from("wbxp.do_missions", "do_missions")
              .where("user_id = :userId", { userId });
          },
          "do_mission",
          "do_mission.mission_id = q.id",
        )
        .andWhere("rule is not null")
        .andWhere("type not in (:...unlimited)", { unlimited })
        .andWhere("campaign_id = :campaignId", { campaignId })
        .andWhere("enable = true")
        .getRawMany();

      missions = missions.map((mission) => {
        delete mission.mission_id;
        mission.is_minted = isDefined(mission.is_minted);
        return mission;
      });

      return missions;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _getUnlimitedMissionsByCampaign(
    campaignId: number,
    userId?: number,
  ): Promise<Missions[]> {
    try {
      const unlimited = [
        MissionsType.REFERRAL,
        MissionsType.SHAKING,
        MissionsType.SEND_LUCKY_BOX,
      ];

      let missions = await this.repoMission
        .createQueryBuilder("q")
        .select("*")
        .addSelect("false", "is_claimed")
        .andWhere("rule is null")
        .andWhere("type in (:...unlimited)", { unlimited })
        .andWhere("campaign_id = :campaignId", { campaignId })
        .andWhere("enable = true")
        .getRawMany();

      return missions;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getMissionsByCampaign(
    campaignId: number,
    userId?: number,
  ): Promise<{ rows: Missions[]; totalReward: number }> {
    try {
      let [dailyCheckinMissions, limitedMissions, unlimitedMissions] =
        await Promise.all([
          this._getDailyMissionsByCampaign(campaignId, userId),
          this._getLimitedMissionsByCampaign(campaignId, userId),
          this._getUnlimitedMissionsByCampaign(campaignId, userId),
        ]);

      const results = [
        ...dailyCheckinMissions,
        ...limitedMissions,
        ...unlimitedMissions,
      ];
      const totalReward = await this._getMissionsReward(results, userId);

      return { rows: results, totalReward };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getDoneMissions(
    userId: number,
    page?: number,
    pageSize?: number,
  ): Promise<ListModel<DoMissions>> {
    try {
      const take = isDefined(pageSize) ? pageSize : 10;
      const skip = isDefined(page) && page > 1 ? (page - 1) * pageSize : 0;

      const [records, total] = await this.repoDoMission.findAndCount({
        where: { userId },
        order: { id: "DESC" },
        take,
        skip,
      });

      return { rows: records, total };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getPendingReward(
    userId: number,
  ): Promise<{ ids: number[]; totalReward: number }> {
    try {
      const result = await this.repoDoMission
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

  public async claimAll(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");

    try {
      const { ids, totalReward } = await this.getPendingReward(userId);

      if (totalReward > 0) {
        const user = await this.userService.getUserById(userId);

        if (isDefined(user.refById)) {
          const refById = user.refById;
          const rewardAmount = totalReward * this.commissionPercentage;
          await this.rewardsService.mintReward(refById, userId, rewardAmount);
        }

        // set isClaimed = true
        await this.repoDoMission.update({ id: In(ids) }, { isClaimed: true });

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

  private async doMission(
    userId: number,
    mission: Missions,
  ): Promise<DoMissions | null> {
    let record: DoMissions;
    const unlimited = [
      MissionsType.REFERRAL,
      MissionsType.SHAKING,
      MissionsType.SEND_LUCKY_BOX,
    ];
    if (unlimited.includes(mission.type)) {
      // unlimited mission
      record = new DoMissions();
      record.userId = userId;
      record.missionId = mission.id;
      record.process = 1;
      record.rewardAmount = mission.rewardAmount;
      record.isClaimed = false;
    } else if (!isDefined(mission.rule)) {
      // not mission rule -> daily mission
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      record = await this.repoDoMission.findOne({
        where: {
          userId,
          missionId: mission.id,
          createdAt: MoreThanOrEqual(date),
        },
      });

      // check previous date
      if (isDefined(record)) {
        this.logger.warn("mission already done");
        return null;
      }

      record = new DoMissions();
      record.userId = userId;
      record.missionId = mission.id;
      record.process = 1;
      record.rewardAmount = mission.rewardAmount;
      record.isClaimed = false;
    } else {
      // limited mission: has rule
      record = await this.repoDoMission.findOne({
        where: { userId, missionId: mission.id },
      });

      if (!isDefined(record)) {
        record = new DoMissions();
        record.userId = userId;
        record.missionId = mission.id;
        record.process = 0;
        record.rewardAmount = 0;
        record.isClaimed = false;
      }
      record.process += 1;

      if (record.process === mission.rule) {
        record.rewardAmount = mission.rewardAmount;
      } else if (record.process > mission.rule) {
        this.logger.warn("mission already done");
        return null;
      }
    }
    return record;
  }

  public async doMissionJoinWaitlist(userId: number) {
    try {
      let mission = await this.getMissionJoinWaitlist();
      if (!isDefined(mission)) {
        this.logger.warn("no mission found");
        return;
      }

      const record = await this.doMission(userId, mission);
      if (isDefined(record)) {
        await this.repoDoMission.save(record);
      }
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async doMissionReferral(userId: number) {
    try {
      const mission = await this.getMissionReferral();
      if (!isDefined(mission)) {
        this.logger.warn("no mission found");
        return;
      }

      let record = await this.doMission(userId, mission);
      if (isDefined(record)) {
        await this.repoDoMission.save(record);
      }
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async doMissionDaily(userId: number, missionId?: number) {
    const now = new Date();

    if (isDefined(missionId)) {
      // daily social mission
      const mission = await this.repoMission.findOne({
        where: {
          id: missionId,
          enable: true,
          type: MissionsType.DAILY_CHECKIN,
        },
      });

      if (!isDefined(mission)) throw new AppError(ERROR_CODE.NOT_FOUND);

      const record = await this.doMission(userId, mission);
      if (isDefined(record)) {
        await this.repoDoMission.save(record, { transaction: false });
      }
    } else {
      // daily checkin mission
      const missions = await this.repoMission.find({
        where: {
          type: MissionsType.DAILY_CHECKIN,
          enable: true,
          link: IsNull(),
        },
      });

      const records: DoMissions[] = [];

      for (let i = 0; i < missions.length; i++) {
        const record = await this.doMission(userId, missions[i]);
        if (isDefined(record)) {
          records.push(record);
        }
      }

      await this.repoDoMission.save(records, { transaction: false });
    }
  }

  public async doMissionMintTicket(userId: number) {
    try {
      let mission = await this.getMissionMintTicket();
      if (!isDefined(mission)) {
        this.logger.warn("no mission found");
        return;
      }

      let record = await this.doMission(userId, mission);
      if (isDefined(record)) {
        await this.repoDoMission.save(record, { transaction: false });
      }
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async doMissionShaking(userId: number) {
    try {
      let mission = await this.getMissionShaking();
      if (!isDefined(mission)) {
        this.logger.warn("no mission found");
        return;
      }

      let record = await this.doMission(userId, mission);
      if (isDefined(record)) {
        await this.repoDoMission.save(record);
      }
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async doMissionSendLuckyBox(userId: number) {
    try {
      let mission = await this.getMissionSendLuckBox();
      if (!isDefined(mission)) {
        this.logger.warn("no mission found");
        return;
      }

      let record = await this.doMission(userId, mission);
      if (isDefined(record)) {
        await this.repoDoMission.save(record);
      }
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async doMissionSocial(userId: number, missionId: number) {
    try {
      const mission = await this.repoMission.findOneOrFail({
        where: { id: missionId, enable: true, link: Not(IsNull()) },
      });

      const record = await this.doMission(userId, mission);

      if (!isDefined(record))
        throw new AppError(ERROR_CODE.BAD_REQUEST, "mission completed");

      await this.repoDoMission.insert(record);

      return record;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof EntityNotFoundError) {
        throw new AppError(ERROR_CODE.NOT_FOUND, "invalid mission");
      }

      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async checkDoMissionFirstShare(userId: number) {
    try {
      const doMission = this.repoDoMission
        .createQueryBuilder("q")
        .leftJoin(
          (qb) => qb.from("wbxp.missions", "mission"),
          "mission",
          "mission.id = q.mission_id",
        )
        .where("user_id = :userId", { userId })
        .andWhere("type = :type", { type: MissionsType.FIRST_SHARE })
        .getExists();

      return doMission;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async doMissionFirstShare(userId: number) {
    try {
      const mission = await this.repoMission.findOneOrFail({
        where: { type: MissionsType.FIRST_SHARE },
      });

      const record = await this.doMission(userId, mission);
      if (!isDefined(record))
        throw new AppError(ERROR_CODE.BAD_REQUEST, "mission completed");

      await this.repoDoMission.insert(record);

      return record;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof EntityNotFoundError) {
        throw new AppError(ERROR_CODE.NOT_FOUND, "invalid mission");
      }

      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
