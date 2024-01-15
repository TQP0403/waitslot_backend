import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { MetadataModule } from "@modules/metadata/metadata.module";
import { FileModule } from "@modules/file/file.module";
import { env } from "@configs/index";
import { MissionsModule } from "@modules/missions/missions.module";
import { KycModule } from "@modules/kyc/kyc.module";
import { UserModule } from "@modules/user/user.module";

@Module({
  imports: [
    MetadataModule,
    PassportModule,
    FileModule,
    KycModule,
    MissionsModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: env.auth.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
