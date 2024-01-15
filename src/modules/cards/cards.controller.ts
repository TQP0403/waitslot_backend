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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { ListDto, ParamId } from "@helpers/index";
import { request } from "http";
import { CardsService } from "./cards.service";

@ApiTags("cards")
@Controller("cards")
export class CardsController {
  constructor(private readonly service: CardsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/list")
  public async getListCard(@Query() query: ListDto) {
    return await this.service.getListCards(query);
  }
}
