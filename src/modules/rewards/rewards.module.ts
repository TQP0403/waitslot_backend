import { Module } from "@nestjs/common";
import { RewardsService } from "./rewards.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rewards } from "./domain/rewards.entity";
import { RewardsController } from "./rewards.controller";
import { UserModule } from "@modules/user/user.module";
import { LeaderboardModule } from "@modules/leaderboard/leaderboard.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rewards]),
    UserModule,
    LeaderboardModule,
    RewardModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardModule {}
