import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDayDataService } from "./user-day-data.service";
import { UserDayData } from "./domain/user-day-data.entity";
import { UserDayDataController } from "./user-day-data.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserDayData])],
  controllers: [UserDayDataController],
  providers: [UserDayDataService],
  exports: [UserDayDataService],
})
export class UserDayDataModule {}
