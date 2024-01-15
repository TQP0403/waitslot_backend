import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Missions } from "./domain/missions.entity";
import { MissionsService } from "./missions.service";
import { MissionsController } from "./missions.controller";
import { DoMissions } from "./domain/do-missions.entity";
import { UserModule } from "@modules/user/user.module";
import { RewardModule } from "@modules/rewards/rewards.module";
import { CacheModule } from "@modules/cache/cache.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Missions, DoMissions]),
    UserModule,
    RewardModule,
    CacheModule,
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
  exports: [MissionsService],
})
export class MissionsModule {}
