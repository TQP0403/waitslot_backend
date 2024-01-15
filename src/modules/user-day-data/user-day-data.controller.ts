import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { UserDayDataService } from "./user-day-data.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DayDataTypeEnum } from "./interfaces/user-day-data.enum";
import { UserDayDataFilterDto } from "./dtos/user-day-data-filter.dto";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { TopRankFilterDto } from "./dtos/top-rank-filter.dto";
import { ListDto, ParamId } from "@helpers/dto.helper";

@ApiTags("user-day-data")
@Controller("user-day-data")
export class UserDayDataController {
  constructor(private readonly service: UserDayDataService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/leader-ranking")
  public async getLeaderRanking(@Req() req: any) {
    return this.service.getUserRanking(
      req.user.userId,
      DayDataTypeEnum.REFERRAL,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/commission")
  public async getCommissionDayData(
    @Req() req: any,
    @Query() query: UserDayDataFilterDto,
  ) {
    return this.service.getDayData(
      req.user.userId,
      DayDataTypeEnum.COMISSION,
      query.filter,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/network-revenue")
  public async getNetworkDayData(
    @Req() req: any,
    @Query() query: UserDayDataFilterDto,
  ) {
    return this.service.getDayData(
      req.user.userId,
      DayDataTypeEnum.NETWORK_REVENUE,
      query.filter,
    );
  }

  @Get("/top-rank/network")
  public async getToprankByNetword(@Query() query: TopRankFilterDto) {
    return this.service.getDayDataRanking(
      DayDataTypeEnum.REFERRAL,
      query.ranking,
      query.filter,
      query.pageSize,
    );
  }

  @Get("/top-rank/revenue")
  public async getToprankByRevenue(@Query() query: TopRankFilterDto) {
    return this.service.getDayDataRanking(
      DayDataTypeEnum.BALANCE,
      query.ranking,
      query.filter,
      query.pageSize,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/list-referral")
  public async listReferral(@Req() req: any, @Query() query: ListDto) {
    return this.service.getUserReferralList(
      req.user.userId,
      DayDataTypeEnum.BALANCE,
      undefined,
      undefined,
      query.page,
      query.pageSize,
    );
  }
}
