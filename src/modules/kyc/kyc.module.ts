import { Module } from "@nestjs/common";
import { KycService } from "./kyc.service";
import { VerificationsModule } from "../verifications/verifications.module";
import { CacheModule } from "@modules/cache/cache.module";

@Module({
  imports: [VerificationsModule, CacheModule],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
