import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DayData } from "./domain/day-data.entity";
import { DayDataResponse } from "./day-data.interface";
import { DateHelper } from "@helpers/date.helper";

@Injectable()
export class DayDataService {
  private readonly logger = new Logger(DayDataService.name);

  constructor(
    @InjectRepository(DayData)
    private readonly repo: Repository<DayData>,
  ) {}

  public async getDayData(): Promise<DayDataResponse> {
    const query = this.repo
      .createQueryBuilder("q")
      .where("q.date <= CURRENT_DATE")
      .andWhere("q.date >= CURRENT_DATE - INTERVAL '1 DAYS'")
      .orderBy({ date: "DESC" });

    const results = await query.getMany();

    let totalBalance = 0;
    let incBalance = 0;
    let incPercentageBalance = 0;

    let totalHolder = 0;
    let incHolder = 0;
    let incPercentageHolder = 0;
    const now = new Date();
    if (results.length === 2) {
      const preData = results[1];
      const curData = results[0];
      totalBalance = curData.totalBalance;
      totalHolder = curData.totalHolder;
      incBalance = curData.totalBalance - preData.totalBalance;
      incHolder = curData.totalHolder - preData.totalHolder;
      incPercentageBalance = (incBalance / preData.totalBalance) * 100;
      incPercentageHolder = (incHolder / preData.totalHolder) * 100;
    } else if (results.length === 1) {
      const dateData = results[0];
      if (dateData.date.toString() === DateHelper.formatDate(now)) {
        totalBalance = dateData.totalBalance;
        totalHolder = dateData.totalHolder;
      }
    }

    return {
      totalBalance,
      incBalance,
      incPercentageBalance,
      totalHolder,
      incHolder,
      incPercentageHolder,
    };
  }
}
