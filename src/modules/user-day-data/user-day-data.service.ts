import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UserDayData } from "./domain/user-day-data.entity";
import {
  DayDataFilterEnum,
  DayDataRankingEnum,
  DayDataTypeEnum,
} from "./interfaces/user-day-data.enum";
import { isDefined } from "class-validator";
import {
  IUserDayDataRecord,
  IUserDayDataResponse,
  IUserTopRankResponse,
} from "./interfaces/user-day-data.interface";
import { ListModel } from "@helpers/dto.helper";

@Injectable()
export class UserDayDataService {
  private readonly logger = new Logger(UserDayDataService.name);
  private rankingQueryDataStr: Map<DayDataTypeEnum, string> = new Map();
  private rankingQueryDateStr: Map<DayDataFilterEnum, string> = new Map();

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(UserDayData)
    private readonly repo: Repository<UserDayData>,
  ) {
    this.rankingQueryDataStr[DayDataTypeEnum.REFERRAL] = "ref_count";
    this.rankingQueryDataStr[DayDataTypeEnum.BALANCE] = "balance";
    this.rankingQueryDataStr[DayDataTypeEnum.NETWORK_REVENUE] =
      "network_revenue";
    this.rankingQueryDataStr[DayDataTypeEnum.COMISSION] = "commission";

    this.rankingQueryDateStr[DayDataFilterEnum.ALL] = "7 DAYS";
    this.rankingQueryDateStr[DayDataFilterEnum.ONE_DAY] = "1 DAYS";
    this.rankingQueryDateStr[DayDataFilterEnum.ONE_WEEK] = "7 DAYS";
    this.rankingQueryDateStr[DayDataFilterEnum.ONE_MONTH] = "30 DAYS";
    this.rankingQueryDateStr[DayDataFilterEnum.ONE_YEAR] = "360 DAYS";
  }

  public async getDayData(
    userId: number,
    type: DayDataTypeEnum,
    filter?: DayDataFilterEnum,
  ): Promise<IUserDayDataResponse> {
    filter = isDefined(filter) ? filter : DayDataFilterEnum.ALL;

    // get data 1 day before
    const query = this.repo
      .createQueryBuilder("q")
      .select("q.date", "date")
      .addSelect(`${this.rankingQueryDataStr[type]}`, "data")
      .where("q.user_id = :userId", { userId })
      .andWhere("q.date <= CURRENT_DATE")
      // .andWhere("q.date <= CURRENT_DATE + INTERVAL '1 DAYS'")
      .orderBy({ date: "ASC" });

    if (filter !== DayDataFilterEnum.ALL) {
      query.andWhere(
        `q.date >= CURRENT_DATE - INTERVAL '${this.rankingQueryDateStr[filter]}'`,
      );
    }

    const rows = await query.getRawMany<IUserDayDataRecord>();
    let currentData = 0;
    let incData = 0;
    let incPercentage = 0;
    const n = rows.length;
    if (n > 1) {
      currentData = rows[n - 1].data;
      const oldData = rows[0].data;
      incData = currentData - oldData;
      incPercentage = (incData / oldData) * 100;
    }

    return { currentData, incData, incPercentage, rows };
  }

  private _getDayDataRankingRawQuery(
    type: DayDataTypeEnum,
    rankFilter?: DayDataRankingEnum,
    filter?: DayDataFilterEnum,
  ): string {
    filter = isDefined(filter) ? filter : DayDataFilterEnum.ONE_WEEK;
    rankFilter = isDefined(rankFilter)
      ? rankFilter
      : DayDataRankingEnum.TRENDING;

    let orderStr = `ORDER BY "incPercentage" desc, "newData" desc `;

    if (rankFilter === DayDataRankingEnum.TOP) {
      orderStr = `ORDER BY "incData" desc, "newData" desc `;
    }

    return `
      SELECT
        "u"."id" as "id",
        "u"."avatar" as "avatar",
        "u"."fullname" as "fullname",
        "u"."ref_by_id" as "refById",
        "q"."user_id" as "userId",
        "q"."balance" as "balance",
        "q"."ref_count" as "refCount",
        "q"."network_revenue" as "networkRevenue",
        "q"."commission" as "commission",
        "new_data" as "newData",
        "old_data" as "oldData",
        "new_data" - "old_data" as "incData",
        CASE
          WHEN "new_data" = 0 AND "old_data" = 0 THEN 0  
          WHEN "old_data" = 0 THEN 100 
          ELSE ("new_data" - "old_data") / "old_data" * 100
        END "incPercentage"
      FROM
      (SELECT
        "balance",
        "ref_count",
        "network_revenue",
        "commission",  
        COALESCE("NEW_DATA_T"."user_id","OLD_DATA_T"."user_id") as "user_id",
        COALESCE("NEW_DATA_T"."data",0) as "new_data",
        COALESCE("OLD_DATA_T"."data",0) as "old_data"   
      FROM
      (SELECT
        "balance",
        "ref_count",
        "network_revenue",
        "commission",    
        "user_id", ${this.rankingQueryDataStr[type]} AS "data"
      FROM "wbxp"."user_day_data" "q" 
      WHERE "q"."date" = CURRENT_DATE) as "NEW_DATA_T"
      LEFT JOIN
      (SELECT
        "user_id", ${this.rankingQueryDataStr[type]} AS "data" 
      FROM "wbxp"."user_day_data" "q" 
      WHERE "q"."date" = CURRENT_DATE - INTERVAL '${this.rankingQueryDateStr[filter]}') as "OLD_DATA_T"
      ON "NEW_DATA_T"."user_id" = "OLD_DATA_T"."user_id") as "q"
      LEFT JOIN "wbxp"."users" "u" ON "q"."user_id" = "u"."id"
      ${orderStr}
    `;
  }

  public async getDayDataRanking(
    type: DayDataTypeEnum,
    rankFilter?: DayDataRankingEnum,
    filter?: DayDataFilterEnum,
    limit?: number,
  ): Promise<ListModel<IUserTopRankResponse>> {
    let rawQueryStr = this._getDayDataRankingRawQuery(type, rankFilter, filter);
    limit = isDefined(limit) ? limit : 10;
    rawQueryStr = `
      SELECT ROW_NUMBER() over (ORDER BY "incData" desc, "newData" desc)::int as "rank", *
      FROM (${rawQueryStr}) as "q"
      LIMIT ${limit}
    `;

    let results =
      await this.dataSource.query<IUserTopRankResponse[]>(rawQueryStr);

    return { total: results.length, rows: results };
  }

  public async getUserRanking(
    userId: number,
    rankFilter: DayDataTypeEnum,
  ): Promise<IUserTopRankResponse> {
    let rawQueryStr = this._getDayDataRankingRawQuery(rankFilter);

    rawQueryStr = `
      SELECT *
      FROM (
        SELECT ROW_NUMBER() over (ORDER BY "incData" desc, "newData" desc)::int as "rank", *
        FROM (${rawQueryStr}) as "q") as "q"
      WHERE id = $1
    `;

    let result = await this.dataSource.query<IUserTopRankResponse[]>(
      rawQueryStr,
      [userId],
    );

    return result.length > 0 ? result[0] : null;
  }

  public async getUserReferralList(
    userId: number,
    type: DayDataTypeEnum,
    rankFilter?: DayDataRankingEnum,
    filter?: DayDataFilterEnum,
    page?: number,
    pageSize?: number,
  ): Promise<ListModel<IUserTopRankResponse>> {
    let rawQueryStr = this._getDayDataRankingRawQuery(type, rankFilter, filter);
    page = isDefined(page) ? page : 1;
    const limit = isDefined(pageSize) ? pageSize : 10;
    const offset = (page - 1) * limit;

    const rawCountStr = `
      SELECT count(1)::int
      FROM (${rawQueryStr}) as "q"
      WHERE "refById" = $1
    `;

    rawQueryStr = `
      SELECT *
      FROM (
        SELECT ROW_NUMBER() over (ORDER BY "incData" desc, "newData" desc)::int as "rank", *
        FROM (${rawQueryStr}) as "q") as "q"
      WHERE "refById" = $1
      LIMIT $2
      OFFSET $3
    `;

    const rawCount = await this.dataSource.query<{ count: number }[]>(
      rawCountStr,
      [userId],
    );

    const results = await this.dataSource.query<IUserTopRankResponse[]>(
      rawQueryStr,
      [userId, limit, offset],
    );

    const count = rawCount[0].count;

    return { total: count, rows: results };
  }

  public async getDataByUserIds(
    userIds: number[],
    type: DayDataTypeEnum,
    rankFilter?: DayDataRankingEnum,
    filter?: DayDataFilterEnum,
    page?: number,
    pageSize?: number,
  ): Promise<ListModel<IUserTopRankResponse>> {
    let rawQueryStr = this._getDayDataRankingRawQuery(type, rankFilter, filter);
    page = isDefined(page) ? page : 1;
    const limit = isDefined(pageSize) ? pageSize : 10;
    const offset = (page - 1) * limit;

    const rawCountStr = `
      SELECT count(1)::int
      FROM (${rawQueryStr}) as "q"
      WHERE "id" = ANY($1)
    `;

    rawQueryStr = `
      SELECT *
      FROM (
        SELECT ROW_NUMBER() over (ORDER BY "incData" desc, "newData" desc)::int as "rank", *
        FROM (${rawQueryStr}) as "q") as "q"
      WHERE "id" = ANY($1)
      LIMIT $2
      OFFSET $3
    `;

    const rawCount = await this.dataSource.query<{ count: number }[]>(
      rawCountStr,
      [userIds],
    );

    const results = await this.dataSource.query<IUserTopRankResponse[]>(
      rawQueryStr,
      [userIds, limit, offset],
    );

    const count = rawCount[0].count;

    return { total: count, rows: results };
  }
}
