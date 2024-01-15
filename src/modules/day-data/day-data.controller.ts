import { Controller, Get } from "@nestjs/common";
import { DayDataService } from "./day-data.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("day-data")
@Controller("day-data")
export class DayDataController {
  constructor(private readonly service: DayDataService) {}

  @Get("/")
  public async getCommissionDayData() {
    return this.service.getDayData();
  }
}
