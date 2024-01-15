import { Injectable, Logger } from "@nestjs/common";
import { Missions } from "../domain/missions.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DoMissions } from "../domain/do-missions.entity";
import { IsNull, MoreThanOrEqual, Repository } from "typeorm";
import { MissionsType } from "../missions.enum";
import { AppError, ERROR_CODE } from "@configs/index";
import { isDefined } from "class-validator";

@Injectable()
export class MissionsWaitlistService {
  private readonly logger = new Logger(MissionsWaitlistService.name);

  constructor(
    @InjectRepository(Missions)
    private readonly repoMission: Repository<Missions>,
    @InjectRepository(DoMissions)
    private readonly repoDoMission: Repository<DoMissions>,
  ) {}

  public async getMission() {
    try {
      const now = new Date();

      const mission = await this.repoMission.findOne({
        where: [
          { type: MissionsType.JOIN_WAITLIST, endTime: IsNull() },
          { type: MissionsType.JOIN_WAITLIST, endTime: MoreThanOrEqual(now) },
        ],
      });

      return mission;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
