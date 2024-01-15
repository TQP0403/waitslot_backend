import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminRegisterDto } from "./dtos/admin-register.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { AdminService } from "./admin.service";
import { AdminLoginDto } from "./dtos/admin-login.dto";
import { JwtAdminGuard } from "./guards/jwt-admin.guard";
import { AdminChangePasswordDto } from "./dtos/admin-change-password.dto";

@ApiTags("admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post("/login")
  public async login(@Body() body: AdminLoginDto) {
    return await this.service.login(body);
  }

  @Post("/refresh-token")
  public async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.service.refreshToken(body.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get("/profile")
  public async getProfile(@Request() req: any) {
    return await this.service.getProfile(req.admin.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Put("/profile/change-password")
  public async changePassword(
    @Request() req: any,
    @Body() body: AdminChangePasswordDto,
  ) {
    return await this.service.changePassword(req.admin.id, body);
  }
}
