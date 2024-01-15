import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DayData } from "./domain/day-data.entity";
import { DayDataController } from "./day-data.controller";
import { DayDataService } from "./day-data.service";

@Module({
  imports: [TypeOrmModule.forFeature([DayData])],
  controllers: [DayDataController],
  providers: [DayDataService],
  exports: [DayDataService],
})
export class DayDataModule {}
