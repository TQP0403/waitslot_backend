import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MissionsService } from "./missions.service";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { ListDto, ParamId } from "@helpers/dto.helper";
import { query } from "express";

@ApiTags("missions")
@Controller("missions")
export class MissionsController {
  constructor(private readonly service: MissionsService) {}

  @Get("/join-waitlist/")
  public async getMissionJoinWaitlist() {
    return await this.service.getMissionJoinWaitlist();
  }

  @Get("/first-share/")
  public async getMissionFirstShare() {
    return await this.service.getMissionFirstShare();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/")
  public async getDoneMissions(@Request() req: any, @Query() query: ListDto) {
    return await this.service.getDoneMissions(
      req.user.userId,
      query.page,
      query.pageSize,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/pending-reward")
  public async getPending(@Request() req: any) {
    const { totalReward } = await this.service.getPendingReward(
      req.user.userId,
    );
    return { totalReward };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/pending-reward/claim")
  public async claimPending(@Request() req: any) {
    return await this.service.claimAll(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/do-mission/:id")
  public async doSocical(@Request() req: any, @Param() params: ParamId) {
    return await this.service.doMissionSocial(req.user.userId, params.id);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post("/do-mission/shaking")
  // public async doShaking(@Request() req: any) {
  //   return await this.service.doMissionShaking(req.user.userId);
  // }
}
