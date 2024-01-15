import { Module } from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tickets } from "./domain/tickets.entity";
import { TicketsController } from "./tickets.controller";
import { MissionsModule } from "@modules/missions/missions.module";
import { CampaignsModule } from "@modules/campaigns/campaigns.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tickets]),
    CampaignsModule,
    MissionsModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
