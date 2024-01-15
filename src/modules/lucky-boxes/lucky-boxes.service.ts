import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LuckyBox } from "./domain/lucky-boxes.entity";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class LuckyBoxesService {
  private readonly logger = new Logger(LuckyBoxesService.name);

  constructor(
    @InjectRepository(LuckyBox)
    private readonly repo: Repository<LuckyBox>,
  ) {}
}
