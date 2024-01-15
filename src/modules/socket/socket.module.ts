import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { SocketService } from "./socket.service";
import { CacheModule } from "@modules/cache/cache.module";
import { CampaignsModule } from "@modules/campaigns/campaigns.module";
import { MissionsModule } from "@modules/missions/missions.module";

@Module({
  imports: [CacheModule, CampaignsModule, MissionsModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
