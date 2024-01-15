import { Module } from "@nestjs/common";
import { ReferralController } from "./referral.controller";
import { ReferralService } from "./referral.service";
import { UserModule } from "@modules/user/user.module";
import { MissionsModule } from "@modules/missions/missions.module";

@Module({
  imports: [UserModule, MissionsModule],
  controllers: [ReferralController],
  providers: [ReferralService],
})
export class ReferralModule {}
