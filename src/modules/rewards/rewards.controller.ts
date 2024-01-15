import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RewardsService } from "./rewards.service";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";

@ApiTags("reward")
@Controller("reward")
export class RewardsController {
  constructor(private readonly service: RewardsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/pending-reward")
  public async getPendingReward(@Req() req: any) {
    const { totalReward } = await this.service.getPendingReward(
      req.user.userId,
    );
    return { totalReward };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/pending-reward/claim")
  public async claimPendingReward(@Req() req: any) {
    return this.service.claimAll(req.user.userId);
  }
}
