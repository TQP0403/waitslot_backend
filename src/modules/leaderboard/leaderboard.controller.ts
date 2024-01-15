import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LeaderboardService } from "./leaderboard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetLeaderboardDto } from "./dtos/get-leaderboard.dto";

@ApiTags("leaderboard")
@Controller("leaderboard")
export class LeaderboardController {
  constructor(private readonly service: LeaderboardService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("")
  public async list(@Request() req: any, @Query() query: GetLeaderboardDto) {
    return await this.service.getUserPosition(
      req.user.userId,
      query.type,
      query.pageSize,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/leader-ranking")
  public async getLeaderRanking(@Request() req: any) {
    return await this.service.getUserLeaderRanking(req.user.userId);
  }
}
