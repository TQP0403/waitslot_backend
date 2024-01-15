import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  Req,
  Post,
  Request,
  Body,
} from "@nestjs/common";
import { LuckyShakingService } from "./lucky-shaking.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { ListDto, ParamId } from "@helpers/index";
import {
  LuckyShakingList,
  LuckyShakingMint,
} from "./dtos/lucky-shaking-mint.dto";

@ApiTags("lucky-shaking")
@Controller("lucky-shaking")
export class LuckyShakingController {
  constructor(private readonly service: LuckyShakingService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/mint")
  public mint(@Request() req: any, @Body() body: LuckyShakingMint) {
    return this.service.mint(req.user.userId, body.toUserId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/list-shaking")
  public getListUserShaking(@Body() body: LuckyShakingList) {
    return this.service.getListUserShaking(body.ids);
  }
}
