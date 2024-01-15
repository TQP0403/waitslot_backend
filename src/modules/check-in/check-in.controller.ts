import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CheckInService } from "./check-in.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("check-in")
@Controller("check-in")
export class CheckInController {
  constructor(private readonly service: CheckInService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("")
  public checkIn(@Request() req: any) {
    return this.service.checkIn(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("is-check-in")
  public isTodayCheckIn(@Request() req: any) {
    return this.service.getLastCheckIn(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("")
  public getCheckInList(@Request() req: any) {
    return this.service.getCheckInList(req.user.userId);
  }
}
