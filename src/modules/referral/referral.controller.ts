import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReferralService } from "./referral.service";
import { ListDto } from "@helpers/index";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { CheckContactDto } from "./dtos/check-contact.dto";

@ApiTags("referral")
@Controller("referral")
export class ReferralController {
  constructor(private readonly service: ReferralService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("")
  public list(@Request() req: any, @Query() query: ListDto) {
    return this.service.listReferral(req.user.userId, query);
  }

  @Post("/check-contact")
  public check(@Body() body: CheckContactDto) {
    return this.service.checkContact(body.contacts);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/first-share")
  public checkFirstShare(@Request() req: any) {
    return this.service.checkFirstShare(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/first-share")
  public doFirstShare(@Request() req: any) {
    return this.service.doFirstShare(req.user.userId);
  }
}
