import { Module } from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Campaigns } from "./domain/campaigns.entity";
import { CampaignsController } from "./campaigns.controller";
import { MissionsModule } from "@modules/missions/missions.module";
import { Participants } from "./domain/participants.entity";
import { UserModule } from "@modules/user/user.module";
import { UserDayDataModule } from "@modules/user-day-data/user-day-data.module";
import { AdminModule } from "@modules/admin/admin.module";
import { FileModule } from "@modules/file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaigns, Participants]),
    AdminModule,
    UserModule,
    MissionsModule,
    UserDayDataModule,
    FileModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
