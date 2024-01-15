import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Transactions } from "./domain/transactions.entity";
import { MissionsService } from "@modules/missions/missions.service";
import { CampaignsService } from "@modules/campaigns/campaigns.service";
import { AppError } from "@configs/app-error";
import { ERROR_CODE } from "@configs/codes";
import { TransactionsType } from "./interfaces/transactions.enum";
import { UserService } from "@modules/user/user.service";
import { ListModel } from "@helpers/dto.helper";

@Injectable()
export class TransactionsService {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transactions)
    private readonly repo: Repository<Transactions>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly missionsService: MissionsService,
  ) {}

  public async sendTransaction(
    fromUserId: number,
    toUserIds: number[],
    amount: number,
    cardId?: number, // Optional cardId parameter
    description?: string, // Optional description parameter
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");

    try {
      // Decrease balance of fromUser
      await this.userService.decreaseUserBalance(
        fromUserId,
        amount * toUserIds.length,
      );

      // Increase balance for each toUser
      for (const toUserId of toUserIds) {
        await this.userService.increaseUserBalance(toUserId, amount);

        const transaction = this.repo.create({
          fromId: fromUserId,
          toId: toUserId,
          amount: amount,
          type: TransactionsType.LUCKY_MONEY,
          cardId: cardId,
          description: description || "Transfer between users",
          createdAt: new Date(),
        });
        this.repo.save(transaction);
      }
      await this.missionsService.doMissionSendLuckyBox(fromUserId);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  public async getTransactionDetail(transactionId: number) {
    try {
      const transaction = await this.repo.findOne({
        where: [{ id: transactionId }],
        relations: ["card", "from", "to"],
      });

      if (!transaction) {
        throw new AppError(ERROR_CODE.NOT_FOUND, "Transaction not found");
      }
      return transaction;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getTransactionHistory(
    userId: number,
  ): Promise<ListModel<Transactions>> {
    try {
      const transactions = await this.repo.find({
        where: [{ fromId: userId }, { toId: userId }],
        order: {
          createdAt: "DESC", // Order by creation date in descending order
        },
        relations: ["from", "to"],
      });

      const totalTransactions = transactions.length;

      return {
        total: totalTransactions,
        rows: transactions,
      };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
