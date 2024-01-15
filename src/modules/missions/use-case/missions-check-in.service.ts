import { Injectable, Logger } from "@nestjs/common";
import { Missions } from "../domain/missions.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DoMissions } from "../domain/do-missions.entity";
import { Repository } from "typeorm";

@Injectable()
export class MissionsCheckinService {
  private readonly logger = new Logger(MissionsCheckinService.name);

  constructor(
    @InjectRepository(Missions)
    private readonly repoMission: Repository<Missions>,
    @InjectRepository(DoMissions)
    private readonly repoDoMission: Repository<DoMissions>,
  ) {}
}
