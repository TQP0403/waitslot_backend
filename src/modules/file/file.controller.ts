import { FileService } from "./file.service";
import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  Get,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UploadRequiredDto, createImageValidator } from "@helpers/index";
import { AdminGuard } from "@modules/admin/guards/admin.decorator";
import { AdminPermission } from "@modules/admin/admin.enum";

@ApiTags("file")
@Controller("file")
export class FilerController {
  constructor(private readonly service: FileService) {}

  @Post("/upload/admin")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @AdminGuard(AdminPermission.UPLOAD_FILE)
  public async uploadFile(
    @UploadedFile(createImageValidator()) file: Express.Multer.File,
    @Body() body: UploadRequiredDto,
  ) {
    return { url: await this.service.upload(file, "assets") };
  }
}
