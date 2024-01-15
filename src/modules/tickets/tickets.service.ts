import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import {
  DataSource,
  EntityNotFoundError,
  IsNull,
  LessThan,
  MoreThan,
  Repository,
} from "typeorm";
import { Tickets } from "./domain/tickets.entity";
import { AppError, ERROR_CODE } from "@configs/index";
import { ListDto, ListModel } from "@helpers/dto.helper";
import { MissionsService } from "@modules/missions/missions.service";
import { CampaignsService } from "@modules/campaigns/campaigns.service";
import { isDefined } from "class-validator";

@Injectable()
export class TicketsService {
  private readonly logger: Logger = new Logger(TicketsService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Tickets)
    private readonly repo: Repository<Tickets>,
    private readonly missionsService: MissionsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  public async purchaseTicket(
    userId: number,
    campaignId: number,
    price: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");

    try {
      const isExist = await this.repo.exist({ where: { userId, campaignId } });

      if (isExist) {
        throw new AppError(ERROR_CODE.CONFLICT, "user had this ticket");
      }

      const ticket = new Tickets();
      ticket.userId = userId;
      ticket.campaignId = campaignId;
      ticket.price = price;
      ticket.isUsed = false;

      await this.missionsService.doMissionMintTicket(userId);
      await this.campaignsService.joinCaimpaign(userId, campaignId);

      await this.repo.save(ticket, { transaction: false });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(error);

      if (error instanceof AppError) throw error;

      throw new AppError(ERROR_CODE.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  public async checkIsUsedTicket(ticketId: number) {
    try {
      const ticket = await this.repo.findOne({
        where: { id: ticketId },
        cache: 30_000,
      });

      if (!ticket) {
        throw new EntityNotFoundError(Tickets, ticketId);
      }

      return { data: ticket.isUsed };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async scanTicket(ticketId: number) {
    try {
      const ticket = await this.repo.findOne({
        where: { id: ticketId },
        cache: 30_000,
      });

      if (ticket.isUsed) {
        throw new AppError(ERROR_CODE.BAD_REQUEST, "Ticket is already used.");
      }

      ticket.isUsed = true;
      await this.repo.save(ticket);
    } catch (error) {
      if (error instanceof AppError) throw error;
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getListTicketByUser(
    userId: number,
    list: ListDto,
  ): Promise<ListModel<Tickets>> {
    try {
      const take = Number(list.pageSize) || 10;
      const skip = Number(list.page) > 0 ? (Number(list.page) - 1) * take : 0;

      const [tickets, total] = await this.repo.findAndCount({
        where: { userId },
        relations: ["campaign", "user"],
        cache: 30_000,
        take,
        skip,
      });

      return {
        total,
        rows: tickets,
      };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getTicketByIds(
    userId: number,
    ticketId: number,
  ): Promise<Tickets> {
    try {
      const result = await this.repo.findOne({
        where: { id: ticketId, userId },
        relations: ["campaign", "user"],
        cache: 30_000,
      });

      if (!isDefined(result))
        throw new AppError(ERROR_CODE.BAD_REQUEST, "ticket not found");

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;

      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async isPurchasedTicket(userId: number, campaignId: number) {
    try {
      const data = await this.repo.exist({
        where: {
          userId: userId,
          campaignId: campaignId,
        },
      });
      return { data: data };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
