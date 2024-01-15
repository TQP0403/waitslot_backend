import { Module } from "@nestjs/common";
import { LuckyShakingService } from "./lucky-shaking.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LuckyShaking } from "./domain/lucky-shaking.entity";
import { MissionsModule } from "@modules/missions/missions.module";
import { UserModule } from "@modules/user/user.module";
import { LuckyShakingController } from "./lucky-shaking.controller";
import { MetadataModule } from "@modules/metadata/metadata.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([LuckyShaking]),
    UserModule,
    MissionsModule,
    MetadataModule,
  ],
  controllers: [LuckyShakingController],
  providers: [LuckyShakingService],
  exports: [LuckyShakingService],
})
export class LuckyShakingModule {}
