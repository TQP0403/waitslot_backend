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
import { TicketsService } from "./tickets.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { ListDto, ParamId } from "@helpers/index";
import { request } from "http";
import { PurchaseDTO } from "./dtos/purchase.dto";

@ApiTags("ticket")
@Controller("ticket")
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/purchase")
  public async purchaseTicket(@Request() req: any, @Body() body: PurchaseDTO) {
    return await this.service.purchaseTicket(
      req.user.userId,
      body.campaignId,
      body.price,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("scan/:id")
  public async scanTicket(@Param() params: ParamId) {
    return await this.service.scanTicket(params.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("check-ticket/:id")
  public async checkTicket(@Param() params: ParamId) {
    return await this.service.checkIsUsedTicket(params.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("check-purchased/:campaignId")
  public async checkPurchasedTicket(
    @Req() req: any,
    @Param("campaignId") campaignId: number,
  ) {
    return await this.service.isPurchasedTicket(req.user.userId, campaignId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("list")
  public async getListTicket(@Req() req: any, @Param() query: ListDto) {
    return await this.service.getListTicketByUser(req.user.userId, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  public async getTicketById(@Req() req: any, @Param() params: ParamId) {
    return await this.service.getTicketByIds(req.user.userId, params.id);
  }
}
