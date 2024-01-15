import { Module, forwardRef } from "@nestjs/common";
import { CheckInController } from "./check-in.controller";
import { CheckInService } from "./check-in.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Checkin } from "./domain/check-in.entity";
import { MissionsModule } from "@modules/missions/missions.module";
import { UserModule } from "@modules/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Checkin]), MissionsModule, UserModule],
  controllers: [CheckInController],
  providers: [CheckInService],
  exports: [CheckInService],
})
export class CheckInModule {}
