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
import { TransactionsService } from "./transactions.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { ListDto, ParamId } from "@helpers/index";
import { sendTxDTO } from "./dtos/sendTx.dto";

@ApiTags("transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/send-tx")
  public async sendTransaction(@Request() req: any, @Body() body: sendTxDTO) {
    return await this.service.sendTransaction(
      req.user.userId,
      body.toUserIds,
      body.amount,
      body.cardId,
      body.description,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/tx-history")
  public async getTransactionHistory(@Request() req: any) {
    return await this.service.getTransactionHistory(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/:id")
  public async getTransactionInformation(@Param() params: ParamId) {
    return await this.service.getTransactionDetail(params.id);
  }
}
