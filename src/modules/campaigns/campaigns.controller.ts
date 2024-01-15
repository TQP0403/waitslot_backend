import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  Req,
  Post,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { ListDto, ParamId, createImageValidator } from "@helpers/index";
import { AdminGuard } from "@modules/admin/guards/admin.decorator";
import { AdminPermission } from "@modules/admin/admin.enum";
import { UpdateCampaignDto } from "./dtos/update-campaign.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("campaign")
@Controller("campaign")
export class CampaignsController {
  constructor(private readonly service: CampaignsService) {}

  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @AdminGuard(AdminPermission.MANAGE_CAMPAIGN)
  @Put("/:id")
  public async setCampaign(
    @Req() req: any,
    @Param() param: ParamId,
    @Body() body: UpdateCampaignDto,
    @UploadedFile(createImageValidator(false)) file: Express.Multer.File,
  ) {
    return this.service.setCampaigns(param.id, body, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/")
  public async getlistActiveCampaigns(
    @Req() req: any,
    @Query() query: ListDto,
  ) {
    return this.service.getListActiveCampaigns(req.user.userId, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  public async getCampaign(@Req() req: any, @Param() param: ParamId) {
    return this.service.getCampaignById(param.id, req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/participants/:id")
  public async getListParticipants(
    @Param() param: ParamId,
    @Param() query: ListDto,
  ) {
    return this.service.getListParticipants(param.id, query);
  }
}
