import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CampaignsModule } from "./modules/campaigns/campaigns.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CheckInModule } from "./modules/check-in/check-in.module";
import { DataSourceConfig } from "./configs/data-source";
import { ReferralModule } from "./modules/referral/referral.module";
import { LeaderboardModule } from "./modules/leaderboard/leaderboard.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { UserDayDataModule } from "./modules/user-day-data/user-day-data.module";
import { DayDataModule } from "./modules/day-data/day-data.module";
import { SocketModule } from "./modules/socket/socket.module";
import { TicketsModule } from "./modules/tickets/tickets.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { CardModule } from "./modules/cards/cards.module";
import { LuckyShakingModule } from "./modules/lucky-shaking/lucky-shaking.module";
import { AdminModule } from "@modules/admin/admin.module";
import { CacheModule } from "@modules/cache/cache.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    CacheModule,
    AdminModule,
    AuthModule,
    CheckInModule,
    ReferralModule,
    LeaderboardModule,
    DashboardModule,
    CampaignsModule,
    UserDayDataModule,
    DayDataModule,
    SocketModule,
    TicketsModule,
    CardModule,
    TransactionsModule,
    LuckyShakingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
