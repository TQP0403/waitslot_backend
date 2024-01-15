import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  EntityNotFoundError,
  IsNull,
  LessThan,
  MoreThan,
  Repository,
} from "typeorm";
import { Campaigns } from "./domain/campaigns.entity";
import { AppError, ERROR_CODE } from "@configs/index";
import { ListDto, ListModel } from "@helpers/dto.helper";
import { MissionsService } from "@modules/missions/missions.service";
import {
  ICampaignAddition,
  ICampaignDetail,
} from "./interfaces/campaigns.interface";
import { Participants } from "./domain/participants.entity";
import { UserDayDataService } from "@modules/user-day-data/user-day-data.service";
import { DayDataTypeEnum } from "@modules/user-day-data/interfaces/user-day-data.enum";
import { IUserTopRankResponse } from "@modules/user-day-data/interfaces/user-day-data.interface";
import { UpdateCampaignDto } from "./dtos/update-campaign.dto";
import { isDefined } from "class-validator";
import { FileService } from "@modules/file/file.service";
import { DateHelper } from "@helpers/date.helper";

@Injectable()
export class CampaignsService {
  private readonly logger: Logger = new Logger(CampaignsService.name);

  constructor(
    @InjectRepository(Campaigns)
    private readonly repo: Repository<Campaigns>,
    @InjectRepository(Participants)
    private readonly participantRepo: Repository<Participants>,
    private readonly missionsService: MissionsService,
    private readonly userDayDataService: UserDayDataService,
    private readonly fileService: FileService,
  ) {}

  // admin set campagin
  public async setCampaigns(
    id: number,
    params: UpdateCampaignDto,
    file: Express.Multer.File,
  ) {
    try {
      const { title, description, priority, startTime, endTime, publish } =
        params;

      const campaign = await this.repo.findOne({ where: { id } });
      if (!isDefined(campaign)) throw new AppError(ERROR_CODE.NOT_FOUND);

      campaign.title = title !== "" ? title : undefined;
      campaign.description = description !== "" ? description : undefined;
      campaign.priority = priority !== 0 ? priority : undefined;

      campaign.startTime = DateHelper.isValidDate(startTime)
        ? startTime
        : undefined;
      campaign.endTime = DateHelper.isValidDate(endTime) ? endTime : undefined;

      if (isDefined(file)) {
        const temp = campaign.banner;
        campaign.banner = await this.fileService.upload(file, "assets");
        await this.fileService.delete(temp);
      }
      if (!isDefined(campaign.publishedAt) && publish) {
        campaign.publishedAt = new Date();
      } else if (isDefined(campaign.publishedAt) && !publish) {
        campaign.publishedAt = null;
      }

      await campaign.save();
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getListActiveCampaigns(
    userId: number,
    list: ListDto,
  ): Promise<ListModel<ICampaignDetail>> {
    try {
      const now = new Date();
      const take = Number(list.pageSize) || 10;
      const skip = Number(list.page) > 0 ? (Number(list.page) - 1) * take : 0;

      let [campaigns, total] = await this.repo.findAndCount({
        cache: 30_000,
        where: [
          { publishedAt: LessThan(now), endTime: MoreThan(now) },
          { publishedAt: LessThan(now), endTime: IsNull() },
        ],
        order: { priority: "ASC", endTime: "DESC" },
        take,
        skip,
      });

      const addtions: ICampaignAddition[] = await Promise.all(
        campaigns.map((campaign) =>
          this.missionsService.getCampaignAdditionDetail(campaign.id, userId),
        ),
      );

      const rows: ICampaignDetail[] = [];
      for (let i = 0; i < campaigns.length; i++) {
        const campaign = campaigns[i];
        const addtion = addtions[i];
        rows.push({ ...campaign, ...addtion });
      }

      return { total, rows };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getCampaignById(
    campaignId: number,
    userId?: number,
  ): Promise<any> {
    const now = new Date();
    try {
      let result = await this.repo.findOneOrFail({
        where: [
          {
            id: campaignId,
            publishedAt: LessThan(now),
            endTime: MoreThan(now),
          },
          { id: campaignId, publishedAt: LessThan(now), endTime: IsNull() },
        ],
        relations: ["hosts"],
        cache: 30_000,
      });

      // TODO: Optimize getMissionsByCampaign and getCampaignAdditionDetail
      const [missions, addtion] = await Promise.all([
        this.missionsService.getMissionsByCampaign(campaignId, userId),
        this.missionsService.getCampaignAdditionDetail(campaignId, userId),
      ]);
      const data: ICampaignDetail = {
        ...result,
        rewardAmount: missions.totalReward,
        totalMintedReward: addtion.totalMintedReward,
        countTotalMinted: addtion.countTotalMinted,
        networks: addtion.networks,
      };

      return { data: data, rows: missions.rows };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof EntityNotFoundError) {
        throw new AppError(ERROR_CODE.NOT_FOUND);
      }

      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  // public async getCampaignMissions(campaignId: number) {
  //   try {
  //     return await this.missionsService.getMissionsByCampaign(campaignId);
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new AppError(ERROR_CODE.SERVER_ERROR);
  //   }
  // }

  public async joinCaimpaign(userId: number, campaignId: number) {
    try {
      const existingParticipant = await this.participantRepo.exist({
        where: { userId, campaignId },
      });

      if (existingParticipant) {
        // throw new AppError(
        //   ERROR_CODE.BAD_REQUEST,
        //   "User already joined the campaign.",
        // );
        return;
      }

      const participant = new Participants();
      participant.userId = userId;
      participant.campaignId = campaignId;
      await participant.save({ transaction: false });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof AppError) throw error;
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getListParticipants(
    campaignId: number,
    list: ListDto,
  ): Promise<ListModel<IUserTopRankResponse>> {
    try {
      const take = Number(list.pageSize) || 10;
      const skip = Number(list.page) > 0 ? (Number(list.page) - 1) * take : 0;

      const participants = await this.participantRepo.find({
        where: { campaignId },
        cache: 30_000,
        take,
        skip, // Optionally include 'user' relation to get user details
      });
      const ids = participants.map((participant) => participant.userId);

      return this.userDayDataService.getDataByUserIds(
        ids,
        DayDataTypeEnum.REFERRAL,
      );
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
