import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Metadata } from "./domain/metadata.entity";
import { AppError, ERROR_CODE } from "@configs/index";

@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name);

  constructor(
    @InjectRepository(Metadata)
    private readonly repo: Repository<Metadata>,
  ) {}

  public async get(cache?: number | boolean): Promise<Metadata> {
    try {
      const result = await this.repo.findOne({ where: { id: 1 }, cache });

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async updateTotalWaitingSlot(metadata: Metadata): Promise<void> {
    try {
      metadata.totalWaitingSlot += 1;
      await this.repo.update(metadata.id, metadata);

      return;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
