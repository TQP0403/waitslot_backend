import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { UserModule } from "@modules/user/user.module";
import { RewardModule } from "@modules/rewards/rewards.module";
import { DayDataModule } from "@modules/day-data/day-data.module";

@Module({
  imports: [UserModule, DayDataModule, RewardModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
