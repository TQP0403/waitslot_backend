import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Cards } from "./domain/cards.entity";
import { FileService } from "@modules/file/file.service";
import { ListDto, ListModel } from "@helpers/dto.helper";
import { AppError } from "@configs/app-error";
import { ERROR_CODE } from "@configs/codes";

@Injectable()
export class CardsService {
  private readonly logger: Logger = new Logger(CardsService.name);

  constructor(
    @InjectRepository(Cards)
    private readonly repo: Repository<Cards>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly fileService: FileService,
  ) {}

  public async createCard(description: string, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");
    try {
      let image = await this.fileService.upload(file);
      const newCard = this.repo.create({
        description,
        image,
      });

      await this.repo.save(newCard);

      await queryRunner.commitTransaction();
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  public async getListCards(list: ListDto): Promise<ListModel<Cards>> {
    const take = Number(list.pageSize) || 10;
    const skip = Number(list.page) > 0 ? (Number(list.page) - 1) * take : 0;
    try {
      const [cards, total] = await this.repo.findAndCount({
        take,
        skip,
        cache: 30_000,
      });

      return {
        total,
        rows: cards,
      };
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
