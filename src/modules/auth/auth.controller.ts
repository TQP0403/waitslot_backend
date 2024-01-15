import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { EditProfileDto } from "./dtos/edit-profile.dto";
import { createImageValidator } from "@helpers/index";
import { FileInterceptor } from "@nestjs/platform-express";
import { SendDto } from "./dtos/send.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get("/check-username/:name")
  public async checkUsername(@Param("name") name: string) {
    return this.service.checkUsername(name);
  }

  @Get("/check-ref-name/:name")
  public async checkRefName(@Param("name") name: string) {
    return this.service.checkRefName(name);
  }

  @Get("/kyc/:username/:token")
  public async checkKyc(
    @Param("username") username: string,
    @Param("token") token: string,
  ) {
    return await this.service.checkKyc(username, token);
  }

  @Post("/kyc")
  public async sendKyc(@Body() body: SendDto) {
    return await this.service.sendKyc(body.username);
  }

  @Post("/login")
  public async login(@Body() body: LoginDto) {
    return await this.service.login(body);
  }

  @Post("/register")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  public async register(
    @Body() body: RegisterDto,
    @UploadedFile(createImageValidator(false)) file?: Express.Multer.File,
  ) {
    return await this.service.register(body, file);
  }

  @Post("/refresh-token")
  public async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.service.refreshToken(body.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  public async getProfile(@Request() req: any) {
    return await this.service.getProfile(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @Put("profile")
  public async updateProfile(
    @Request() req: any,
    @Body() body: EditProfileDto,
    @UploadedFile(createImageValidator(false)) file: Express.Multer.File,
  ) {
    return await this.service.editProfile(
      req.user.userId,
      file,
      body.fullname,
      body.bio,
    );
  }
}
