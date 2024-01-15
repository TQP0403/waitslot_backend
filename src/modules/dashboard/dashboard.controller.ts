import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";

@ApiTags("dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get("/")
  public async get() {
    return this.service.getDashboard();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/profile")
  public async getProfile(@Req() req: any) {
    return this.service.getUserProfileDashboard(req.user.userId);
  }

  @Get("/top-banner")
  public async getTopBanner() {
    return this.service.getTopBanner();
  }
}
